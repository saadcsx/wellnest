import { Link } from "react-router-dom"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/landing/Navbar"
import Footer from "@/components/landing/Footer"
import { SectionHeading } from "@/components/landing/SectionHeading"
import { useAuth } from "@/context/AuthContext"
import { useTitle } from "@/lib/use-title"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "always free",
    body: "Everything you need to try Wellnest on real encounters.",
    features: ["Unlimited assessments", "Specialty forms and free text", "Patient records for one clinician", "PDF export"],
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$10",
    period: "per month, billed annually",
    body: "For clinicians who document at volume.",
    features: ["Everything in Free", "Voice dictation with transcription", "Custom form builder", "Priority support"],
    highlight: true,
  },
] as const

/** Static pricing table. The Next.js version rendered Clerk's hosted <PricingTable />. */
export default function PricingPage() {
  useTitle("Pricing")
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="px-6 pb-24 pt-36">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans for individuals and teams."
          body="Start free. Upgrade when you need more assessments, seats or storage."
        />

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 md:grid-cols-2">
          {plans.map((p) => {
            const current = (user?.plan ?? "free") === p.id
            return (
              <section
                key={p.id}
                className={p.highlight ? "glass flex flex-col rounded-3xl p-7 shadow-glass" : "surface flex flex-col p-7"}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold tracking-tight">{p.name}</h2>
                  {current && user && <Badge variant="accent">Current plan</Badge>}
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {p.price}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">{p.period}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.25} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-7" variant={p.highlight ? "default" : "outline"} disabled={current && !!user}>
                  <Link to={user ? "/dashboard" : "/sign-up"}>{user ? (current ? "Included" : "Contact us to upgrade") : "Get started"}</Link>
                </Button>
              </section>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
