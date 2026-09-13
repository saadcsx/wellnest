import { useEffect } from "react"

import { BRAND } from "@/components/brand/Logo"

/** Sets document.title the way Next's metadata template did: "Page | Wellnest". */
export function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${BRAND.name}` : `${BRAND.name} | ${BRAND.tagline.replace(/\.$/, "")}`
  }, [title])
}
