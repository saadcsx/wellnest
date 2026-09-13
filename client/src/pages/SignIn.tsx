import { Link, Navigate } from "react-router-dom"

import { AuthForm } from "@/components/AuthForm"
import { AuthShell } from "@/components/AuthShell"
import { useAuth } from "@/context/AuthContext"
import { useTitle } from "@/lib/use-title"

export default function SignInPage() {
  useTitle("Sign in")
  const { user, isLoading } = useAuth()
  if (!isLoading && user) return <Navigate to="/dashboard" replace />

  return (
    <AuthShell
      hint={
        <>
          New here?{" "}
          <Link to="/sign-up" className="text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="sign-in" />
    </AuthShell>
  )
}
