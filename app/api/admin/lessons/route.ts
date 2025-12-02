import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyAdminAccess } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET lessons (filter by chapter_id or course_id)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const chapterId = searchParams.get('chapter_id')
    const courseId = searchParams.get('course_id')
    
    let query = supabase
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (chapterId) {
      query = query.eq('chapter_id', chapterId)
    } else if (courseId) {
      query = query.eq('course_id', courseId)
    }
    
    const { data: lessons, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Failed to fetch lessons:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van lessen' },
      { status: 500 }
    )
  }
}

// POST create new lesson
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { 
      course_id, 
      chapter_id, 
      title, 
      description, 
      content,
      order_index, 
      is_free,
      type,
      video_url,
      is_published 
    } = body
    
    if (!course_id || !chapter_id || !title || !type) {
      return NextResponse.json(
        { error: 'Cursus ID, hoofdstuk ID, titel en type zijn verplicht' },
        { status: 400 }
      )
    }
    
    // Validate lesson type
    const validTypes = ['TEXT', 'VIDEO', 'QUIZ']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Ongeldig les type. Kies TEXT, VIDEO of QUIZ' },
        { status: 400 }
      )
    }
    
    // Get the next order_index if not provided
    let orderIdx = order_index
    if (orderIdx === undefined || orderIdx === null) {
      const { data: existingLessons } = await supabase
        .from('lessons')
        .select('order_index')
        .eq('chapter_id', chapter_id)
        .order('order_index', { ascending: false })
        .limit(1)
      
      orderIdx = existingLessons && existingLessons.length > 0
        ? existingLessons[0].order_index + 1
        : 0
    }
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        course_id,
        chapter_id,
        title,
        description: description || null,
        content: content || null,
        order_index: orderIdx,
        is_free: is_free ?? false,
        type,
        video_url: video_url || null,
        is_published: is_published ?? false,
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Failed to create lesson:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de les' },
      { status: 500 }
    )
  }
}
