import { Link } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import { ArrowRight, FileText, Mic, LayoutList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BRAND } from "@/components/brand/Logo"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const inputs = [
  { icon: LayoutList, label: "Specialty forms" },
  { icon: FileText, label: "Free-text notes" },
  { icon: Mic, label: "Voice dictation" },
]

export default function Hero() {
  return (
    <section className="px-6 pb-16 pt-36 md:pb-24 md:pt-44">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.p variants={fadeUp} className="eyebrow mb-5">
          Clinical documentation, without the paperwork
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl"
        >
          From patient encounter to structured assessment in one pass.
        </motion.h1>

        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
          {BRAND.description} Identifiers stay on your side; only the clinical
          content is analysed.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/dashboard">
              Start an assessment
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="#workflow">See how it works</Link>
          </Button>
        </motion.div>

        <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {inputs.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] text-foreground/80"
            >
              <Icon className="h-3.5 w-3.5 text-primary" />
              {label}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}
