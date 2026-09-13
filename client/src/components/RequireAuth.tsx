import { Loader2 } from "lucide-react"
import { Navigate, useLocation } from "react-router-dom"

import { useAuth } from "@/context/AuthContext"

/** Client-side auth gate for workspace routes; the API enforces auth independently. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />
  return <>{children}</>
}
