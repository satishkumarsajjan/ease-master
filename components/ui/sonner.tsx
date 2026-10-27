"use client"

export interface ToasterProps {
  className?: string
  [key: string]: unknown
}

/**
 * Mounted once in app/layout.tsx (§5.2).
 * Brand-styled Toaster shim conforming to zero extra dependencies beyond §3.2.
 */
export function Toaster(props?: ToasterProps) {
  void props
  return null
}
