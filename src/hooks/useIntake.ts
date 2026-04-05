import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type IntakeDocument = Database['public']['Tables']['intake_documents']['Row'];
type IntakeEmail = Database['public']['Tables']['intake_emails']['Row'];
type ExtractedField = Database['public']['Tables']['extracted_fields']['Row'];

export function useIntakeDocuments() {
  return useQuery({
    queryKey: ['intake-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intake_documents')
        .select('*, extracted_fields(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useIntakeEmails() {
  return useQuery({
    queryKey: ['intake-emails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intake_emails')
        .select('*')
        .order('received_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useDocumentById(documentId: string | null) {
  return useQuery({
    queryKey: ['intake-document', documentId],
    queryFn: async () => {
      if (!documentId) return null;
      const { data, error } = await supabase
        .from('intake_documents')
        .select('*, extracted_fields(*)')
        .eq('id', documentId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!documentId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      // Upload file to storage
      const filePath = `uploads/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('intake-documents')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Create document record
      const { data, error } = await supabase
        .from('intake_documents')
        .insert({
          file_name: file.name,
          file_type: file.name.split('.').pop() || 'unknown',
          file_size: file.size,
          file_path: filePath,
          upload_source: 'manual',
          document_type: 'unknown',
          processing_status: 'queued',
          processing_progress: 0,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-documents'] });
    },
  });
}

export function useProcessDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, action = 'process' }: { documentId: string; action?: 'classify' | 'extract' | 'process' }) => {
      const { data, error } = await supabase.functions.invoke('process-document', {
        body: { documentId, action },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-documents'] });
    },
  });
}

export function useAcceptField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ fieldId, accepted }: { fieldId: string; accepted: boolean }) => {
      const { error } = await supabase
        .from('extracted_fields')
        .update({ accepted })
        .eq('id', fieldId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-documents'] });
    },
  });
}

export function useAcceptAllFields() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('extracted_fields')
        .update({ accepted: true })
        .eq('document_id', documentId);
      if (error) throw error;

      await supabase
        .from('intake_documents')
        .update({ processing_status: 'accepted' })
        .eq('id', documentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intake-documents'] });
    },
  });
}
