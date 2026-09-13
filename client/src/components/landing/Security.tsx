import { motion } from "framer-motion"
import { EyeOff, KeyRound, Lock, UserCheck } from "lucide-react"

import { SectionHeading } from "./SectionHeading"

const points = [
  {
    icon: EyeOff,
    title: "De-identified analysis",
    body: "Patient name, age, sex, arrival time and ID are stripped client-side before any clinical text is sent to the model.",
  },
  {
    icon: UserCheck,
    title: "Per-user records",
    body: "Every patient record and custom form is scoped to the signed-in clinician. Nothing is shared across accounts.",
  },
  {
    icon: KeyRound,
    title: "Managed authentication",
    body: "Passwords are hashed with bcrypt and never stored in plain text. Sessions use short-lived JWTs in httpOnly cookies.",
  },
  {
    icon: Lock,
    title: "Encrypted at rest and in transit",
    body: "Records live in MongoDB with TLS on every connection and encryption at rest on Atlas.",
  },
]

export default function Security() {
  return (
    <section id="security" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="surface grid gap-10 p-8 md:grid-cols-[1fr_1.4fr] md:p-12">
          <SectionHeading
            align="left"
            eyebrow="Security & data handling"
            title="Designed so the model never sees who the patient is."
            body="Clinical decision support is only useful if it can be trusted with the data. These are the defaults, not options."
          />

          <ul className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {points.map((p, i) => (
              <motion.li
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex gap-3.5"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-accent/60 text-primary">
                  <p.icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-[14px] font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
