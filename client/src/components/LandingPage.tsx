import Navbar from "./landing/Navbar"
import Hero from "./landing/Hero"
import ScreenShots from "./landing/ScreenShots"
import Features from "./landing/Features"
import Working from "./landing/Working"
import Security from "./landing/Security"
import CTASection from "./landing/CTASection"
import Footer from "./landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Single, static backdrop: a faint radial tint behind the hero. No animation, no gradients between hues. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[60vh] w-[90vw] -translate-x-1/2 rounded-full bg-accent/60 blur-[120px]" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <ScreenShots />
        <Features />
        <Working />
        <Security />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
