import { Bug } from 'lucide-react'

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-linear-(--gradient-hero) py-12 text-white"
    >
      <div className="container mx-auto px-4">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Bug className="h-8 w-8" />
              <span className="text-2xl font-bold">UVTester</span>
            </div>
            <p className="text-sm text-white/80">
              Nền tảng kết nối cộng đồng Tester Việt Nam với các dự án phát
              triển phần mềm.
            </p>
          </div>

          {/* For Testers */}
          <div>
            <h4 className="mb-4 font-bold">Dành Cho Tester</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Tìm Dự Án
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Tạo Profile
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Hướng Dẫn
                </a>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h4 className="mb-4 font-bold">Dành Cho Công Ty</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Đăng Dự Án
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Tìm Tester
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Bảng Giá
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-bold">Hỗ Trợ</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Liên Hệ
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Chính Sách
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2024 UVTester. Nền tảng kết nối Tester Việt Nam.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
