
-- TÌM USER MỚI NHẤT (Hoặc bạn có thể thay bằng UUID cụ thể của bạn)
WITH target_user AS (
  SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1
)

-- 1. Cập nhật HoSoTester cho User này để khớp với dự án
INSERT INTO public."HoSoTester" (
  "maNguoiDung",
  "thongTinThietBi",
  "thongTinKiemThu", 
  "ngonNguChinh", 
  "soNamKinhNghiem"
)
SELECT 
  id, 
  -- Devices khớp: Desktop (Laptop) và Android
  '{
    "devices": [
      {
        "id": "dev1",
        "name": "Asus Gaming Laptop",
        "type": "desktop", 
        "category": "Laptop",
        "os": "Windows",
        "osVersion": "11"
      },
      {
        "id": "dev2",
        "name": "Samsung Galaxy Ultra",
        "type": "mobile",
        "category": "Smartphone",
        "os": "Android",
        "osVersion": "14"
      }
    ]
  }'::jsonb, 
  -- Skills khớp: Game, RPG, Mobile
  '{
    "skills": ["Game Testing", "Mobile Testing", "RPG", "Manual Test"]
  }'::jsonb, 
  'Vietnamese', 
  3
FROM target_user
ON CONFLICT ("maNguoiDung") DO UPDATE SET
  "thongTinThietBi" = EXCLUDED."thongTinThietBi",
  "thongTinKiemThu" = EXCLUDED."thongTinKiemThu",
  "soNamKinhNghiem" = EXCLUDED."soNamKinhNghiem";

-- 2. Cập nhật Giới thiệu để khớp Vector Search
UPDATE public."NguoiDung"
SET "gioiThieu" = 'Tester chuyên nghiệp với 3 năm kinh nghiệm test Game Mobile và PC. Đam mê thể loại RPG và MOBA.'
WHERE "maNguoiDung" = (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1);

-- 3. Tạo Dự án Mới (Perfect Match với User trên)
INSERT INTO public."DuAn" (
  "tenDuAn",
  "maDuAnHienThi",
  "tieuDe",
  "moTa",
  "loaiDuAn",
  "nganSach",
  "trangThaiDuAn", 
  "cauHinhThanhToan",
  "yeuCauMoiTruong",
  "phamViTest",
  "thoiHanUngTuyen",
  "soLuongCanTuyen",
  "ngayTao",
  "maKhachHang" 
) VALUES (
  'Super Game RPG Test',
  'AI-MATCH-99',
  'Tuyển dụng Tester cho Game RPG Mobile & PC (Lương cao)',
  'Dự án Game RPG bom tấn sắp ra mắt. Cần tester có kinh nghiệm test game nhập vai, am hiểu quy trình test trên PC và Android.',
  'Game',
  10000000,
  'DangTuyen',
  '{"perCompletion": 500000}'::jsonb,
  -- Yêu cầu: PC (khớp Laptop) + Android (khớp Samsung) -> Device Score 60/60
  '{
    "devices": ["PC", "Android"],
    "os": ["Windows", "Android 10+"]
  }'::jsonb,
  -- Scope khớp keywords: Game, RPG, Mobile, PC
  'Test toàn bộ gameplay từ lv1 đến lv50. Test toàn bộ gameplay từ lv1 đến lv50.',
  NOW() + INTERVAL '10 days',
  5,
  NOW(),
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1) -- Set owner là user hiện tại luôn cho tiện
);
