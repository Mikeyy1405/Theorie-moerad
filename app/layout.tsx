import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { SessionWrapper } from '@/components/session-wrapper'

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'TheorieExamen Platform - Nederlandse CBR Theorie Training',
  description: 'Complete online platform voor Nederlandse theorie examens. Auto en Motor theorie cursussen met praktijkvragen en AI begeleiding.',
  openGraph: {
    title: 'TheorieExamen Platform - Nederlandse CBR Theorie Training',
    description: 'Complete online platform voor Nederlandse theorie examens. Auto en Motor theorie cursussen met praktijkvragen en AI begeleiding.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <SessionWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  )
}
