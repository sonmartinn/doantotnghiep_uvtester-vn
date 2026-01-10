-- Enable RLS on BaoCaoLoi to ensure security
ALTER TABLE "public"."BaoCaoLoi" ENABLE ROW LEVEL SECURITY;

-- Drop the policy if it exists to avoid errors on retry (optional, but good for idempotency if strictly Sql)
-- DROP POLICY IF EXISTS "Clients can update bugs in their projects" ON "public"."BaoCaoLoi";

-- Policy: Allow Project Owners (Clients) to UPDATE bugs
CREATE POLICY "Clients can update bugs in their projects"
ON "public"."BaoCaoLoi"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "public"."DuAn"
    WHERE "DuAn"."maDuAn" = "BaoCaoLoi"."maDuAn"
    AND "DuAn"."maNguoiTao" = auth.uid()
  )
);
