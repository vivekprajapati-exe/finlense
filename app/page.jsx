import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Benefits } from "@/components/benefits"
import { Testimonials } from "@/components/testimonials"
import { Pricing } from "@/components/pricing"

export default function Home() {
  return (
    <>
    <Hero />
      <Features />
      <Benefits />
      <Testimonials />
      <Pricing />
    </>
  );
}
