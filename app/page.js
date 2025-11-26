import Hero from '@/app/_components/Hero'
import Features from '@/app/_components/Features'
import HowItWorks from '@/app/_components/HowItWorks'

export default function Home() {
  return (
    <div className="min-h-screen">
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
