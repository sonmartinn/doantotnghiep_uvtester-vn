import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/ui/sonner'

export const metadata = {
  title: 'UVTester - Kết nối cộng đồng Tester Việt Nam',
  description:
    'Nền tảng kết nối các Tester chuyên nghiệp và tự do tại Việt Nam, cung cấp dịch vụ kiểm thử phần mềm chất lượng cao và đáng tin cậy.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
