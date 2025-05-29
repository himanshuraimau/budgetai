import { Hero } from "@/components/marketing/hero"
import { Features } from "@/components/marketing/features"
import { DemoSection } from "@/components/marketing/demo-section"
import { Testimonials } from "@/components/marketing/testimonials"
import { Pricing } from "@/components/marketing/pricing"
import { CTASection } from "@/components/marketing/cta-section"

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <DemoSection />
      <Testimonials />
      <Pricing />
      <CTASection />
    </>
  )
}
