
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { Header } from '@/components/header'

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  
  if (session?.user) {
    if (session.user.role === 'ADMIN') {
      redirect('/admin')
    } else {
      redirect('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <main className="py-12">
        <LoginForm />
      </main>
    </div>
  )
}
