import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CTASection() {
  return (
    <section className="px-6 pb-24 pt-8 md:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl px-8 py-14 text-center shadow-glass md:px-16"
      >
        <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] md:text-4xl">
          Start your next assessment in Wellnest.
        </h2>
        <p className="max-w-xl text-balance text-base leading-relaxed text-muted-foreground md:text-lg">
          Sign in, pick an input method and have a structured report in front of you before the next patient is called.
        </p>
        <Button asChild size="lg">
          <Link to="/dashboard">
            Open the workspace
            <ArrowRight />
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}
