
'use client'

import { Button } from '@/components/ui/button'
import { LayoutDashboard, BookOpen, Users, Settings, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'courses', label: 'Cursussen', icon: BookOpen },
  { id: 'users', label: 'Gebruikers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Instellingen', icon: Settings },
]

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? 'default' : 'ghost'}
            className={cn(
              'w-full justify-start',
              activeTab === item.id && 'bg-blue-600 hover:bg-blue-700'
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
