import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// GET chapters (optionally filter by course_id)
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('course_id')
    
    let query = supabase
      .from('chapters')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (courseId) {
      query = query.eq('course_id', courseId)
    }
    
    const { data: chapters, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Failed to fetch chapters:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van hoofdstukken' },
      { status: 500 }
    )
  }
}

// POST create new chapter
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { course_id, title, description, order_index, is_published } = body
    
    if (!course_id || !title) {
      return NextResponse.json(
        { error: 'Cursus ID en titel zijn verplicht' },
        { status: 400 }
      )
    }
    
    // Get the next order_index if not provided
    let orderIdx = order_index
    if (orderIdx === undefined || orderIdx === null) {
      const { data: existingChapters } = await supabase
        .from('chapters')
        .select('order_index')
        .eq('course_id', course_id)
        .order('order_index', { ascending: false })
        .limit(1)
      
      orderIdx = existingChapters && existingChapters.length > 0
        ? existingChapters[0].order_index + 1
        : 0
    }
    
    const { data: chapter, error } = await supabase
      .from('chapters')
      .insert({
        course_id,
        title,
        description: description || null,
        order_index: orderIdx,
        is_published: is_published ?? false,
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error('Failed to create chapter:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van het hoofdstuk' },
      { status: 500 }
    )
  }
}
