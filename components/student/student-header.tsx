
'use client'

import { Button } from '@/components/ui/button'
import { BookOpen, LogOut, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

export function StudentHeader() {
  const { data: session } = useSession() || {}

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">
            Mijn Dashboard
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>
              {session?.user?.firstName} {session?.user?.lastName}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Uitloggen
          </Button>
        </div>
      </div>
    </header>
  )
}
