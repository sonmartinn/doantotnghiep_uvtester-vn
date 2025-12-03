import { Button } from '@/app/_components/ui/button'
import { ArrowRight, Users, Briefcase } from 'lucide-react'
import heroImage from '@/app/_assets/hero-bg.png'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden py-10 md:py-24">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-linear-(--gradient-hero) opacity-90" />
        <Image
          src={heroImage}
          alt="UVTester Platform"
          className="h-full w-full object-cover opacity-50 mix-blend-overlay"
        />
      </div>

      {/* Floating shapes */}
      <div className="bg-primary/20 animate-float absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl" />
      <div
        className="bg-accent/20 animate-float absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl"
        style={{ animationDelay: '1s' }}
      />

      {/* Content */}
      <div className="z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in-up mx-auto max-w-4xl space-y-8">
          <h1 className="text-5xl leading-tight font-bold text-white md:text-7xl">
            Kết Nối Tester & Dự Án
            <br />
            <span className="text-primary-glow">Nhanh Chóng - Hiệu Quả</span>
          </h1>

          <p className="mx-auto max-w-2xl text-xl text-white/90 md:text-2xl">
            Nền tảng kết nối cộng đồng Tester Việt Nam với các dự án phát triển
            phần mềm. Tìm dự án phù hợp hoặc tuyển dụng tester chuyên nghiệp chỉ
            trong vài phút.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="text-primary shadow-glow rounded-xl bg-white px-8 py-6 text-lg hover:bg-white/90"
              asChild
            >
              <Link href="/register?role=tester">
                <Users className="mr-2 h-5 w-5" />
                Tôi Là Tester
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-white/30 bg-white/10 px-8 py-6 text-lg text-white backdrop-blur-sm hover:bg-white/20"
              asChild
            >
              <Link href="/register?role=client">
                <Briefcase className="mr-2 h-5 w-5" />
                Tôi Cần Tester
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-8 pt-12">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">500+</div>
              <div className="text-white/80">Tester</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">200+</div>
              <div className="text-white/80">Dự Án</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-white">98%</div>
              <div className="text-white/80">Hài Lòng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
