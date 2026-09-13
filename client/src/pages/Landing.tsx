import LandingPage from "@/components/LandingPage"
import { useTitle } from "@/lib/use-title"

export default function Landing() {
  useTitle()
  return <LandingPage />
}
