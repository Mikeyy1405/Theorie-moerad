
import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturesSection } from '@/components/home/features-section'
import { CoursesSection } from '@/components/home/courses-section'
import { StatsSection } from '@/components/home/stats-section'
import { CTASection } from '@/components/home/cta-section'
import { Footer } from '@/components/footer'
import { AIChat } from '@/components/ai-chat'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  // Redirect authenticated users to their dashboard
  if (session?.user) {
    if (session.user.role === 'ADMIN') {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
      <Suspense fallback={<div></div>}>
        <AIChat />
      </Suspense>
    </div>
  )
}
