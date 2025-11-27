
'use client'

import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>{children}</div>
  }

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
