import { motion } from "framer-motion"
import { Blocks, Brain, FileDown, Mic, ShieldCheck, Users } from "lucide-react"

import { SectionHeading } from "./SectionHeading"

const features = [
  {
    icon: Blocks,
    title: "Specialty-aware forms",
    body: "Emergency, cardiology and more ship ready to use. Build your own with the drag-and-drop editor when the defaults don’t fit.",
  },
  {
    icon: Brain,
    title: "Structured AI assessment",
    body: "Free text or form data becomes a consistent report: complaint, history, examination, differential, plan, follow-up and red flags.",
  },
  {
    icon: Mic,
    title: "Voice dictation",
    body: "Record at the bedside or upload audio. The transcript is editable before anything is analysed.",
  },
  {
    icon: ShieldCheck,
    title: "Identity kept separate",
    body: "Name, age, sex and arrival time never leave your workspace. Only de-identified clinical content is sent for analysis.",
  },
  {
    icon: Users,
    title: "Patient records",
    body: "Save, search and reopen previous assessments. Existing records update in place instead of duplicating.",
  },
  {
    icon: FileDown,
    title: "Print-ready reports",
    body: "Export a clean, paginated report for the notes or a referral in one click.",
  },
]

export default function Features() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Capabilities"
          title="Everything the assessment needs. Nothing it doesn’t."
          body="Built for clinicians who document dozens of encounters a shift and want each one to read the same way."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.07 }}
              className="surface group p-6 transition-colors hover:bg-white"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-hairline bg-accent/60 text-primary">
                <f.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 text-[15px] font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
