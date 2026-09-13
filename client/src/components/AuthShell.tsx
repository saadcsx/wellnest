import { Link } from "react-router-dom"

import { BRAND, Logo } from "@/components/brand/Logo"

/**
 * Shared frame for the sign-in and sign-up routes: brand on the left,
 * Clerk's form on the right, stacked on small screens.
 */
export function AuthShell({ children, hint }: { children: React.ReactNode; hint: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center px-6">
        <Logo />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="glass grid w-full max-w-4xl overflow-hidden rounded-3xl shadow-glass md:grid-cols-[1fr_1.1fr]">
          <aside className="hidden flex-col justify-between border-r border-hairline bg-accent/40 p-10 md:flex">
            <div>
              <p className="eyebrow">{BRAND.name}</p>
              <h1 className="mt-4 text-balance text-2xl font-semibold leading-snug tracking-tight">{BRAND.tagline}</h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{BRAND.description}</p>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>· Specialty forms, free text or dictation</li>
              <li>· Identifiers never sent for analysis</li>
              <li>· Records scoped to your account</li>
            </ul>
          </aside>

          <section className="flex flex-col items-center justify-center p-6 md:p-10">
            {children}
            <p className="mt-6 text-center text-xs text-muted-foreground">{hint}</p>
          </section>
        </div>
      </main>

      <footer className="px-6 pb-6 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          ← Back to overview
        </Link>
      </footer>
    </div>
  )
}
