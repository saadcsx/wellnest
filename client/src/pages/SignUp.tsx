import { Link, Navigate } from "react-router-dom"

import { AuthForm } from "@/components/AuthForm"
import { AuthShell } from "@/components/AuthShell"
import { useAuth } from "@/context/AuthContext"
import { useTitle } from "@/lib/use-title"

export default function SignUpPage() {
  useTitle("Create account")
  const { user, isLoading } = useAuth()
  if (!isLoading && user) return <Navigate to="/dashboard" replace />

  return (
    <AuthShell
      hint={
        <>
          Already have an account?{" "}
          <Link to="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-up" />
    </AuthShell>
  )
}
