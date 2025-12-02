import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyAdminAccess } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET all courses
export async function GET() {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van cursussen' },
      { status: 500 }
    )
  }
}

// POST create new course
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { title, description, price, category, image_url, is_active, slug } = body
    
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Titel en slug zijn verplicht' },
        { status: 400 }
      )
    }
    
    const { data: course, error } = await supabase
      .from('courses')
      .insert({
        title,
        description: description || null,
        price: price ? parseFloat(price) : null,
        category: category || null,
        image_url: image_url || null,
        is_active: is_active ?? true,
        slug,
      })
      .select()
      .single()
    
    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Een cursus met deze slug bestaat al' },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Failed to create course:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de cursus' },
      { status: 500 }
    )
  }
}
