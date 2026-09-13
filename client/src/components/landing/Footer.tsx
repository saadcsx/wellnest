import { Link } from "react-router-dom"

import { BRAND, Logo } from "@/components/brand/Logo"

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Overview", href: "/#product" },
      { label: "Workflow", href: "/#workflow" },
      { label: "Security", href: "/#security" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Create account", href: "/sign-up" },
      { label: "Workspace", href: "/dashboard" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-hairline px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{BRAND.tagline}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground/80">
            {BRAND.name} supports clinical documentation. It does not replace clinical judgement, and its output should be
            reviewed by a qualified clinician before use.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:gap-16">
          {columns.map((c) => (
            <div key={c.heading}>
              <h3 className="eyebrow mb-4">{c.heading}</h3>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-sm text-foreground/75 transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-hairline pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </p>
        <p>Built for clinicians.</p>
      </div>
    </footer>
  )
}
