# Quy Trình Xác Thực (Authentication Flow)

Tài liệu này mô tả luồng đăng ký, đăng nhập và xác thực người dùng trong dự án `doantotnghiep_uvtester-vn`.

## 1. Đăng Ký (Registration)

- **File:** `app/(auth)/register/page.js`
- **Công nghệ:** Supabase Auth (`signUp`)
- **Quy trình:**
  1. Người dùng nhập Email, Mật khẩu và chọn Vai trò (Tester/Client).
  2. Hệ thống gọi `supabase.auth.signUp()`:
     - Lưu `role` vào `user_metadata`.
     - Thiết lập `emailRedirectTo` trỏ về trang `/confirm`.
  3. Nếu thành công, hiển thị thông báo yêu cầu kiểm tra email.

## 2. Xác Thực Email & Tạo Hồ Sơ (Confirmation)

- **File:** `app/(auth)/confirm/page.js`
- **Logic:**
  1. Người dùng click link trong email -> Chuyển hướng về `/confirm`.
  2. Hệ thống kiểm tra session người dùng (`supabase.auth.getUser()`).
  3. **Đồng bộ Database:**
     - Kiểm tra xem `maNguoiDung` đã tồn tại trong bảng `NguoiDung` chưa.
     - Nếu chưa -> Thêm mới bản ghi vào bảng `NguoiDung` với thông tin: `maNguoiDung`, `email`, `vaiTro`.
  4. **Điều hướng (Routing):**
     - Nếu là `tester` -> Chuyển đến `/dashboard/tester`.
     - Nếu là `client` -> Chuyển đến `/dashboard/client`.

## 3. Đăng Nhập (Login)

- **File:** `app/(auth)/login/page.js`
- **Quy trình:**
  1. Người dùng nhập Email và Mật khẩu.
  2. Hệ thống gọi `supabase.auth.signInWithPassword()`.
  3. Nếu thành công -> Chuyển hướng về trang chủ `/`.
