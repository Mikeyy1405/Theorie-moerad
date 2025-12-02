
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { AdminStats } from '@/components/admin/admin-stats'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { CourseList } from '@/components/admin/courses'

const AdminHeader = dynamic(() => import('@/components/admin/admin-header').then(mod => ({ default: mod.AdminHeader })), {
  ssr: false,
  loading: () => <div className="h-16 bg-white shadow-sm border-b"></div>
})

const AIChat = dynamic(() => import('@/components/ai-chat').then(mod => ({ default: mod.AIChat })), {
  ssr: false
})

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && <AdminStats />}
          {activeTab === 'courses' && <CourseList />}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Gebruiker Beheer</h2>
              <p className="text-gray-600">Gebruiker beheer functionaliteit komt binnenkort beschikbaar.</p>
            </div>
          )}
        </main>
      </div>
      <AIChat />
    </div>
  )
}
