import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DOCUMENT_TYPE_PROMPTS: Record<string, string> = {
  census: "This is a census/enrollment file. Extract: total employee count, column headers found, coverage tiers, plan names, any date ranges.",
  sob: "This is a Summary of Benefits document. Extract: plan types, deductibles (individual/family), out-of-pocket maximums, coinsurance rates, copays, Rx tiers, network type.",
  experience: "This is a claims experience report. Extract: reporting period, total paid claims, number of large claimants (over $50K), largest single claim amount, loss ratio if shown.",
  application: "This is a stop-loss application. Extract: group name, effective date, contract type (specific/aggregate), requested deductible levels, employer size.",
  rfp_letter: "This is an RFP request letter. Extract: specific deductible levels requested, contract basis (12/12, 12/15, etc.), aggregate coverage requested (yes/no), any special terms.",
  id_cards: "These are insurance ID cards. Extract: carrier name, plan name, group number, any network identifiers.",
  unknown: "Document type unknown. Try to identify the document type and extract any insurance-related data: group name, dates, plan details, financial figures.",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentId, action } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === "classify") {
      return await classifyDocument(supabase, documentId, LOVABLE_API_KEY);
    } else if (action === "extract") {
      return await extractFields(supabase, documentId, LOVABLE_API_KEY);
    } else if (action === "process") {
      // Full pipeline: classify then extract
      const classifyResult = await classifyDocumentInternal(supabase, documentId, LOVABLE_API_KEY);
      if (classifyResult.error) {
        return new Response(JSON.stringify({ error: classifyResult.error }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return await extractFields(supabase, documentId, LOVABLE_API_KEY);
    } else {
      return new Response(JSON.stringify({ error: "Invalid action. Use 'classify', 'extract', or 'process'." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("process-document error:", e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function classifyDocumentInternal(
  supabase: ReturnType<typeof createClient>,
  documentId: string,
  apiKey: string
) {
  // Get document info
  const { data: doc, error: docError } = await supabase
    .from("intake_documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (docError || !doc) {
    return { error: "Document not found" };
  }

  // Update status to classifying
  await supabase
    .from("intake_documents")
    .update({ processing_status: "classifying", processing_progress: 10 })
    .eq("id", documentId);

  const prompt = `You are a document classification AI for a stop-loss insurance underwriting platform. 
Classify this document based on its filename and any available metadata.

Filename: ${doc.file_name}
File type: ${doc.file_type}
File size: ${doc.file_size} bytes

Classify into one of these types:
- census: Employee/member enrollment data
- sob: Summary of Benefits / plan descriptions  
- experience: Claims experience / loss run reports
- application: Stop-loss application forms
- rfp_letter: RFP request letters / quote specifications
- id_cards: Insurance ID cards
- unknown: Cannot determine

Respond with ONLY a JSON object: {"type": "census", "confidence": 0.92, "reasoning": "brief reason"}`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are a document classification specialist for insurance underwriting. Always respond with valid JSON only." },
        { role: "user", content: prompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "classify_document",
            description: "Classify a document into a predefined type",
            parameters: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["census", "sob", "experience", "application", "rfp_letter", "id_cards", "unknown"] },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                reasoning: { type: "string" },
              },
              required: ["type", "confidence", "reasoning"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "classify_document" } },
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      await supabase.from("intake_documents").update({ processing_status: "error", errors: ["Rate limited. Please try again later."] }).eq("id", documentId);
      return { error: "Rate limited" };
    }
    if (response.status === 402) {
      await supabase.from("intake_documents").update({ processing_status: "error", errors: ["AI credits exhausted. Please add funds."] }).eq("id", documentId);
      return { error: "Payment required" };
    }
    const text = await response.text();
    console.error("AI gateway error:", response.status, text);
    await supabase.from("intake_documents").update({ processing_status: "error", errors: [`AI classification failed: ${response.status}`] }).eq("id", documentId);
    return { error: "AI classification failed" };
  }

  const aiResult = await response.json();
  let classification = { type: "unknown", confidence: 0.5, reasoning: "Could not parse" };

  try {
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      classification = JSON.parse(toolCall.function.arguments);
    }
  } catch {
    console.error("Failed to parse classification result");
  }

  await supabase
    .from("intake_documents")
    .update({
      ai_classified_type: classification.type,
      ai_classification_confidence: classification.confidence,
      processing_status: "extracting",
      processing_progress: 40,
    })
    .eq("id", documentId);

  return { success: true, classification };
}

async function classifyDocument(
  supabase: ReturnType<typeof createClient>,
  documentId: string,
  apiKey: string
) {
  const result = await classifyDocumentInternal(supabase, documentId, apiKey);
  if (result.error) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function extractFields(
  supabase: ReturnType<typeof createClient>,
  documentId: string,
  apiKey: string
) {
  const { data: doc, error: docError } = await supabase
    .from("intake_documents")
    .select("*")
    .eq("id", documentId)
    .single();

  if (docError || !doc) {
    return new Response(JSON.stringify({ error: "Document not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await supabase
    .from("intake_documents")
    .update({ processing_status: "extracting", processing_progress: 50 })
    .eq("id", documentId);

  const docType = doc.ai_classified_type || doc.document_type || "unknown";
  const typePrompt = DOCUMENT_TYPE_PROMPTS[docType] || DOCUMENT_TYPE_PROMPTS.unknown;

  const prompt = `You are a data extraction AI for stop-loss insurance underwriting.

Document: ${doc.file_name} (${doc.file_type}, ${doc.file_size} bytes)
Classification: ${docType}

${typePrompt}

For each field extracted, provide a confidence score (0-1) and the source location (e.g., "Page 1", "Header Row", "Cell A1").
Extract as many relevant fields as possible.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: "You are an insurance document data extraction specialist. Extract structured fields from documents." },
        { role: "user", content: prompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extract_fields",
            description: "Extract structured fields from an insurance document",
            parameters: {
              type: "object",
              properties: {
                fields: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field_name: { type: "string" },
                      value: { type: "string" },
                      confidence: { type: "number", minimum: 0, maximum: 1 },
                      source_location: { type: "string" },
                    },
                    required: ["field_name", "value", "confidence"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["fields"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "extract_fields" } },
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      await supabase.from("intake_documents").update({ processing_status: "error", errors: ["Rate limited. Please try again later."] }).eq("id", documentId);
      return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (response.status === 402) {
      await supabase.from("intake_documents").update({ processing_status: "error", errors: ["AI credits exhausted."] }).eq("id", documentId);
      return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const text = await response.text();
    console.error("AI extraction error:", response.status, text);
    await supabase.from("intake_documents").update({ processing_status: "error", errors: [`Extraction failed: ${response.status}`] }).eq("id", documentId);
    return new Response(JSON.stringify({ error: "Extraction failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const aiResult = await response.json();
  let extractedFields: Array<{ field_name: string; value: string; confidence: number; source_location?: string }> = [];

  try {
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const parsed = JSON.parse(toolCall.function.arguments);
      extractedFields = parsed.fields || [];
    }
  } catch {
    console.error("Failed to parse extraction result");
  }

  // Store extracted fields in DB
  if (extractedFields.length > 0) {
    const fieldsToInsert = extractedFields.map((f) => ({
      document_id: documentId,
      field_name: f.field_name,
      value: f.value,
      confidence: f.confidence,
      source_location: f.source_location || null,
      accepted: f.confidence >= 0.9,
    }));

    await supabase.from("extracted_fields").insert(fieldsToInsert);
  }

  // Update document status
  const hasLowConfidence = extractedFields.some((f) => f.confidence < 0.8);
  await supabase
    .from("intake_documents")
    .update({
      processing_status: hasLowConfidence ? "review" : "accepted",
      processing_progress: 100,
    })
    .eq("id", documentId);

  return new Response(
    JSON.stringify({
      success: true,
      fieldsExtracted: extractedFields.length,
      status: hasLowConfidence ? "review" : "accepted",
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}
