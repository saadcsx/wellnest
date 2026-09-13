import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/** Scrolls to the element named by the URL hash after client-side navigation, otherwise to the top. */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }
    // Wait a frame so the target page has rendered before we look the element up.
    const id = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    return () => cancelAnimationFrame(id)
  }, [pathname, hash])

  return null
}
