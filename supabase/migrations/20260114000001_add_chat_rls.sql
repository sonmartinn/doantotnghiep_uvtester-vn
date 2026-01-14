-- Enable RLS on TinNhan if not already enabled
ALTER TABLE "public"."TinNhan" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view messages of channels they have access to
CREATE POLICY "Users can view messages of accessible channels" ON "public"."TinNhan"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "public"."KenhChat" kc
            WHERE kc."maKenh" = "TinNhan"."maKenh"
            AND (
                kc."loaiKenh" = 'PUBLIC' 
                OR 
                (kc."thanhVien" @> jsonb_build_array(auth.uid()))
            )
        )
    );

-- Policy: Users can insert messages into channels they have access to
-- AND they must be the sender (maNguoiGui = auth.uid())
CREATE POLICY "Users can insert messages into accessible channels" ON "public"."TinNhan"
    FOR INSERT WITH CHECK (
        auth.uid() = "maNguoiGui"
        AND
        EXISTS (
            SELECT 1 FROM "public"."KenhChat" kc
            WHERE kc."maKenh" = "TinNhan"."maKenh"
            AND (
                kc."loaiKenh" = 'PUBLIC' 
                OR 
                (kc."thanhVien" @> jsonb_build_array(auth.uid()))
            )
        )
    );
