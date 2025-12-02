import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { NextResponse } from 'next/server'

export async function verifyAdminAccess() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return { 
      authorized: false, 
      error: NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 }
      )
    }
  }
  
  if (session.user.role !== 'ADMIN') {
    return { 
      authorized: false, 
      error: NextResponse.json(
        { error: 'Geen toegang. Admin rechten vereist.' },
        { status: 403 }
      )
    }
  }
  
  return { authorized: true, session }
}
