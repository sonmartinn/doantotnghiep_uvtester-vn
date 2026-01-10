-- Allow authenticated users to insert new notifications
CREATE POLICY "Allow authenticated users to send notifications" ON "public"."ThongBao"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);
