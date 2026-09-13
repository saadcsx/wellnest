import { motion } from "framer-motion"

import { SectionHeading } from "./SectionHeading"

const steps = [
  {
    n: "01",
    title: "Register the patient",
    body: "Add name, age, sex and arrival time. These identifiers stay local and are attached to the report only after analysis.",
  },
  {
    n: "02",
    title: "Capture the encounter",
    body: "Pick a specialty form, paste clinical notes, or dictate. Whichever is fastest for the situation in front of you.",
  },
  {
    n: "03",
    title: "Review and file",
    body: "A structured assessment appears in seconds. Check it, save it to the record, and export a print-ready report.",
  },
]

export default function Working() {
  return (
    <section id="workflow" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Workflow"
          title="Three steps, under a minute."
          body="The same sequence every time, so the output is comparable across clinicians and shifts."
        />

        <ol className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="glass relative rounded-2xl p-6 pt-7 shadow-glass"
            >
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <h3 className="mt-3 text-[15px] font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 hidden h-px w-6 bg-foreground/15 md:block"
                />
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
