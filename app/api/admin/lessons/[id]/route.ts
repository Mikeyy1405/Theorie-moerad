import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// GET single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient()
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Les niet gevonden' },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Failed to fetch lesson:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van de les' },
      { status: 500 }
    )
  }
}

// PUT update lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { 
      title, 
      description, 
      content,
      order_index, 
      is_free,
      type,
      video_url,
      is_published 
    } = body
    
    if (!title || !type) {
      return NextResponse.json(
        { error: 'Titel en type zijn verplicht' },
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
    
    const { data: lesson, error } = await supabase
      .from('lessons')
      .update({
        title,
        description: description || null,
        content: content || null,
        order_index: order_index ?? 0,
        is_free: is_free ?? false,
        type,
        video_url: video_url || null,
        is_published: is_published ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Failed to update lesson:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het bijwerken van de les' },
      { status: 500 }
    )
  }
}

// DELETE lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Les verwijderd' })
  } catch (error) {
    console.error('Failed to delete lesson:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwijderen van de les' },
      { status: 500 }
    )
  }
}
