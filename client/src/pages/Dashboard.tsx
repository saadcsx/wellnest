import Dashboard from "@/components/Dashboard"
import Header from "@/components/Header"
import { RequireAuth } from "@/components/RequireAuth"
import { useTitle } from "@/lib/use-title"

export default function DashboardPage() {
  useTitle("Workspace")
  return (
    <RequireAuth>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <Header />
        <div className="flex min-h-0 flex-1 flex-col">
          <Dashboard />
        </div>
      </div>
    </RequireAuth>
  )
}
