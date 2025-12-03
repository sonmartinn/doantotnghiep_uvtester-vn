import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/ui/sonner'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'UVTester - Kết nối cộng đồng Tester Việt Nam',
  description:
    'Nền tảng kết nối các Tester chuyên nghiệp và tự do tại Việt Nam, cung cấp dịch vụ kiểm thử phần mềm chất lượng cao và đáng tin cậy.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}>
      <body className={`antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
