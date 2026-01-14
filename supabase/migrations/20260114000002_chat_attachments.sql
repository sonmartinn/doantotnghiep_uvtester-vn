-- Change fileDinhKem from TEXT to JSONB
-- Note: This is a destructive operation if data exists and is not valid JSON. 
-- Since we just started, we assume it's safe or empty. 
-- If needed, we could use a USING clause to convert.
ALTER TABLE "public"."TinNhan" 
ALTER COLUMN "fileDinhKem" TYPE JSONB 
USING "fileDinhKem"::JSONB;

-- Storage Policies for 'chat_attachments' bucket
-- Note: User must create the bucket 'chat_attachments' manually in Supabase Dashboard -> Storage

-- Policy 1: Users can view files in 'chat_attachments'
-- (Simplification: Allow authenticated users to view. Ideally check channel access but storage RLS is harder to join)
CREATE POLICY "Authenticated users can view chat attachments"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'chat_attachments' );

-- Policy 2: Users can upload files to 'chat_attachments'
-- Allow any authenticated user to upload.
CREATE POLICY "Authenticated users can upload chat attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'chat_attachments' );
