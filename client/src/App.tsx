import { Suspense, lazy } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { Loader2 } from "lucide-react"

import { ScrollToHash } from "@/components/ScrollToHash"
import { AuthProvider } from "@/context/AuthContext"
import Landing from "@/pages/Landing"
import SignIn from "@/pages/SignIn"
import SignUp from "@/pages/SignUp"

// The workspace pulls in dnd-kit, react-hook-form and the form builder; keep it out of the landing bundle.
const Dashboard = lazy(() => import("@/pages/Dashboard"))
const Pricing = lazy(() => import("@/pages/Pricing"))

const Fallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
    <Loader2 className="h-5 w-5 animate-spin" />
  </div>
)

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ScrollToHash />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "!rounded-xl !border !border-black/[0.06] !bg-white/90 !text-sm !text-foreground !shadow-soft !backdrop-blur-xl",
          }}
        />
        <Suspense fallback={<Fallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
