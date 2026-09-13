import { Link, useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import toast from "react-hot-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/Logo"
import { useAuth } from "@/context/AuthContext"

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success("Signed out")
    navigate("/")
  }

  return (
    <header className="glass sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-x-0 border-t-0 px-4 md:px-5">
      <div className="flex items-center gap-3">
        <Logo href="/dashboard" />
        {user?.plan === "premium" ? (
          <Badge variant="accent" className="hidden sm:inline-flex">
            Premium
          </Badge>
        ) : (
          <Link to="/pricing" className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline">
            Upgrade
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span className="hidden text-sm text-foreground/80 sm:inline">{user.name}</span>
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground ring-1 ring-black/[0.06]"
            >
              {initials(user.name)}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out" title="Sign out">
              <LogOut />
            </Button>
          </>
        ) : (
          <>
            <Button asChild variant="ghost" size="sm">
              <Link to="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/sign-up">Create account</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
