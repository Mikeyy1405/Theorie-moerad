
'use client'

import dynamic from 'next/dynamic'
import { StudentOverview } from '@/components/student/student-overview'

const StudentHeader = dynamic(() => import('@/components/student/student-header').then(mod => ({ default: mod.StudentHeader })), {
  ssr: false,
  loading: () => <div className="h-16 bg-white shadow-sm border-b"></div>
})

const AIChat = dynamic(() => import('@/components/ai-chat').then(mod => ({ default: mod.AIChat })), {
  ssr: false
})

export function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader />
      <main className="p-6">
        <StudentOverview />
      </main>
      <AIChat />
    </div>
  )
}
