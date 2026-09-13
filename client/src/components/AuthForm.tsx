import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/context/AuthContext"

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
})

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
})

type SignInValues = z.infer<typeof signInSchema>
type SignUpValues = z.infer<typeof signUpSchema>

/**
 * Email + password form used by both auth routes. Styled to sit inside
 * AuthShell like the hosted Clerk card did in the Next.js version.
 */
export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const { login, register: registerUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [serverError, setServerError] = useState<string | null>(null)

  const isSignUp = mode === "sign-up"
  const form = useForm<SignUpValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema.extend({ name: z.string().optional() })),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = async (values: SignUpValues | SignInValues) => {
    setServerError(null)
    try {
      if (isSignUp) {
        const v = values as SignUpValues
        await registerUser(v.name, v.email, v.password)
        toast.success("Welcome to Wellnest")
      } else {
        await login(values.email, values.password)
      }
      const from = (location.state as { from?: string } | null)?.from
      navigate(from && from !== "/sign-in" ? from : "/dashboard", { replace: true })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  const { errors, isSubmitting } = form.formState

  return (
    <div className="w-full max-w-sm">
      <header className="mb-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight">{isSignUp ? "Create your account" : "Sign in to Wellnest"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isSignUp ? "A workspace for your assessments and records." : "Welcome back. Enter your details to continue."}
        </p>
      </header>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {isSignUp && (
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" autoComplete="name" placeholder="Dr Amina Rahman" {...form.register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@hospital.org" {...form.register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={isSignUp ? "new-password" : "current-password"}
            placeholder={isSignUp ? "At least 8 characters" : "••••••••"}
            {...form.register("password")}
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        {serverError && (
          <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/[0.05] px-3 py-2 text-sm text-destructive">
            {serverError}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSignUp ? "Create account" : "Continue"}
        </Button>
      </form>
    </div>
  )
}
