import { motion } from "framer-motion"

import { SectionHeading } from "./SectionHeading"

const shots = [
  {
    src: "/clinical.png",
    title: "Assessment report",
    body: "Presenting complaint, history, differential, plan and red flags, laid out the way a handover reads.",
  },
  {
    src: "/form-builder.png",
    title: "Form builder",
    body: "Compose specialty-specific intake forms by dragging field types into place. No configuration files.",
  },
  {
    src: "/patients.png",
    title: "Patient records",
    body: "Every saved assessment is searchable by name, ID or diagnosis, and reopens exactly as it was left.",
  },
]

export default function ScreenShots() {
  return (
    <section id="product" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Product"
          title="One workspace for capture, review and records."
          body="Three views, one consistent layout. Nothing to learn twice."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {shots.map((s, i) => (
            <motion.figure
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="surface overflow-hidden"
            >
              {/* Screenshots are ~2.1:1; match that so nothing is cropped. */}
              <div className="relative aspect-[21/10] border-b border-hairline bg-muted/40">
                <img src={s.src} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-left-top" />
              </div>
              <figcaption className="p-5">
                <h3 className="text-[15px] font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
