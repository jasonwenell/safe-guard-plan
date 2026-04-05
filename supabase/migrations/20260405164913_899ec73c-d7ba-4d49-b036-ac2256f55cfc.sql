
-- Create enum types
CREATE TYPE public.document_type AS ENUM ('census', 'sob', 'experience', 'application', 'rfp_letter', 'id_cards', 'unknown');
CREATE TYPE public.document_processing_status AS ENUM ('queued', 'classifying', 'extracting', 'review', 'accepted', 'rejected', 'error');
CREATE TYPE public.email_processing_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'skipped');

-- Intake emails table
CREATE TABLE public.intake_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_address TEXT NOT NULL,
  from_name TEXT,
  subject TEXT NOT NULL,
  body_preview TEXT,
  to_address TEXT,
  cc_addresses TEXT[],
  received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_status public.email_processing_status NOT NULL DEFAULT 'pending',
  tpa_detected TEXT,
  group_detected TEXT,
  attachment_count INTEGER NOT NULL DEFAULT 0,
  ai_summary TEXT,
  rfp_id TEXT,
  thread_id TEXT,
  thread_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.intake_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view emails" ON public.intake_emails FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert emails" ON public.intake_emails FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update emails" ON public.intake_emails FOR UPDATE TO authenticated USING (true);

-- Intake documents table
CREATE TABLE public.intake_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_path TEXT,
  upload_source TEXT NOT NULL DEFAULT 'manual' CHECK (upload_source IN ('email', 'manual')),
  email_id UUID REFERENCES public.intake_emails(id) ON DELETE SET NULL,
  rfp_id TEXT,
  document_type public.document_type NOT NULL DEFAULT 'unknown',
  ai_classified_type public.document_type,
  ai_classification_confidence REAL,
  processing_status public.document_processing_status NOT NULL DEFAULT 'queued',
  processing_progress INTEGER DEFAULT 0,
  page_count INTEGER,
  errors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.intake_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view documents" ON public.intake_documents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert documents" ON public.intake_documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update documents" ON public.intake_documents FOR UPDATE TO authenticated USING (true);

-- Extracted fields table
CREATE TABLE public.extracted_fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.intake_documents(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  value TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0,
  source_location TEXT,
  accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.extracted_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view extracted fields" ON public.extracted_fields FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert extracted fields" ON public.extracted_fields FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update extracted fields" ON public.extracted_fields FOR UPDATE TO authenticated USING (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_intake_emails_updated_at BEFORE UPDATE ON public.intake_emails FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_intake_documents_updated_at BEFORE UPDATE ON public.intake_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('intake-documents', 'intake-documents', false);

CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'intake-documents');
CREATE POLICY "Authenticated users can view documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'intake-documents');

-- Indexes
CREATE INDEX idx_intake_documents_email_id ON public.intake_documents(email_id);
CREATE INDEX idx_intake_documents_rfp_id ON public.intake_documents(rfp_id);
CREATE INDEX idx_intake_documents_status ON public.intake_documents(processing_status);
CREATE INDEX idx_extracted_fields_document_id ON public.extracted_fields(document_id);
CREATE INDEX idx_intake_emails_status ON public.intake_emails(processing_status);
