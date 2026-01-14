-- Add thanhVien column to KenhChat to support private chats
ALTER TABLE "public"."KenhChat" ADD COLUMN IF NOT EXISTS "thanhVien" JSONB DEFAULT NULL;

-- Policy Update (if RLS is strict)
-- Allow users to see channels they are a member of OR public channels
DROP POLICY IF EXISTS "Users can view channels they belong to" ON "public"."KenhChat";
CREATE POLICY "Users can view channels they belong to" ON "public"."KenhChat"
    FOR SELECT USING (
        "loaiKenh" = 'PUBLIC' 
        OR 
        ("thanhVien" @> jsonb_build_array(auth.uid()))
    );

-- Allow creating channels (needed for triggers or server actions)
CREATE POLICY "Users can insert channels" ON "public"."KenhChat"
    FOR INSERT WITH CHECK (true);
