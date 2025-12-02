import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
