import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ShieldCheck, UserRound } from "lucide-react"
import toast from "react-hot-toast"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

const profileSchema = z.object({ name: z.string().trim().min(2, "Enter your name") })

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.newPassword === v.confirm, { path: ["confirm"], message: "Passwords don't match" })

/** Account settings — replaces Clerk's hosted <UserProfile /> with the same two concerns: profile and password. */
export default function Settings() {
  const { user, setUser } = useAuth()

  return (
    <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-3xl space-y-4 p-4 md:p-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your profile and how you sign in.</p>
        </div>

        <Panel icon={UserRound} title="Profile" subtitle="How your name appears in the workspace and on reports.">
          <ProfileForm initialName={user?.name ?? ""} onSaved={setUser} />
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-hairline pt-4 text-sm">
            <span className="text-muted-foreground">Signed in as</span>
            <span className="font-medium">{user?.email}</span>
            <Badge variant={user?.plan === "premium" ? "accent" : "outline"} className="capitalize">
              {user?.plan ?? "free"} plan
            </Badge>
          </div>
        </Panel>

        <Panel icon={ShieldCheck} title="Password" subtitle="Choose a strong password you don't use elsewhere.">
          <PasswordForm />
        </Panel>
      </div>
    </div>
  )
}

function Panel({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof UserRound
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <section className="surface p-5">
      <header className="mb-4 flex items-start gap-2.5">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-accent/60 text-primary">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  )
}

function ProfileForm({ initialName, onSaved }: { initialName: string; onSaved: (u: NonNullable<ReturnType<typeof useAuth>["user"]>) => void }) {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: initialName },
  })

  const submit = async ({ name }: z.infer<typeof profileSchema>) => {
    try {
      onSaved(await api.auth.update({ name }))
      toast.success("Profile updated")
      form.reset({ name })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update profile")
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1 space-y-1.5">
        <Label htmlFor="profile-name">Full name</Label>
        <Input id="profile-name" {...form.register("name")} />
        {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
        {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
        Save
      </Button>
    </form>
  )
}

function PasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirm: "" },
  })

  const submit = async (values: z.infer<typeof passwordSchema>) => {
    setError(null)
    try {
      await api.auth.update({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      toast.success("Password changed")
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change password")
    }
  }

  const { errors, isSubmitting } = form.formState

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-3 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="current-password">Current password</Label>
        <Input id="current-password" type="password" autoComplete="current-password" {...form.register("currentPassword")} />
        {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="new-password">New password</Label>
        <Input id="new-password" type="password" autoComplete="new-password" {...form.register("newPassword")} />
        {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <Input id="confirm-password" type="password" autoComplete="new-password" {...form.register("confirm")} />
        {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive sm:col-span-3">
          {error}
        </p>
      )}
      <div className="sm:col-span-3 flex justify-end">
        <Button type="submit" variant="outline" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          Change password
        </Button>
      </div>
    </form>
  )
}
