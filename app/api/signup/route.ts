import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, role = 'STUDENT' } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email en wachtwoord zijn verplicht' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Wachtwoord moet minimaal 6 karakters zijn' },
        { status: 400 }
      )
    }

    // Use Supabase Auth to create user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || null,
          last_name: lastName || null,
          role: role.toUpperCase()
        }
      }
    })

    if (error) {
      console.error('Signup error:', error)
      return NextResponse.json(
        { error: error.message || 'Er is een fout opgetreden bij het aanmaken van het account' },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Account aanmaken mislukt' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Gebruiker succesvol aangemaakt',
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: firstName,
        lastName: lastName,
        role: role
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Er is een onverwachte fout opgetreden' },
      { status: 500 }
    )
  }
}
