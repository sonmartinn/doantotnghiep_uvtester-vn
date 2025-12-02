import Hero from '@/components/sections/landing/hero'
import Features from '@/components/sections/landing/features'
import HowItWorks from '@/components/sections/landing/how-it-works'

export default function Home() {
  return (
    <div className="min-h-dvh pt-16 md:pt-0">
      <Hero />
      <section id="features">
        <Features />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
    </div>
  )
}
