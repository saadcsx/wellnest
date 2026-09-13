import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/Logo"
import { useAuth } from "@/context/AuthContext"

const links = [
  { href: "/#product", label: "Product" },
  { href: "/#workflow", label: "Workflow" },
  { href: "/#security", label: "Security" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-4 pl-5 shadow-glass">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm text-foreground/70 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {!user && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/sign-in">Sign in</Link>
            </Button>
          )}
          <Button asChild size="sm">
            <Link to="/dashboard">{user ? "Open workspace" : "Get started"}</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-6xl rounded-2xl p-3 shadow-glass md:hidden">
          <div className="flex flex-col">
            {links.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-foreground/[0.05]"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-hairline pt-3">
              {!user && (
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/sign-in">Sign in</Link>
                </Button>
              )}
              <Button asChild className="flex-1">
                <Link to="/dashboard">{user ? "Open workspace" : "Get started"}</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
