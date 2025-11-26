import './globals.css'
import Navbar from './_components/NavBar'
import Footer from '@/app/_components/Footer'

export const metadata = {
  title: 'UVTester - Kết nối cộng đồng Tester Việt Nam',
  description:
    'Nền tảng kết nối các Tester chuyên nghiệp và tự do tại Việt Nam, cung cấp dịch vụ kiểm thử phần mềm chất lượng cao và đáng tin cậy.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
