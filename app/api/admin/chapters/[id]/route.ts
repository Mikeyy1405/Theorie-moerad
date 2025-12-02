import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyAdminAccess } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET single chapter
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    
    const { data: chapter, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Hoofdstuk niet gevonden' },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Failed to fetch chapter:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van het hoofdstuk' },
      { status: 500 }
    )
  }
}

// PUT update chapter
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { title, description, order_index, is_published } = body
    
    if (!title) {
      return NextResponse.json(
        { error: 'Titel is verplicht' },
        { status: 400 }
      )
    }
    
    const { data: chapter, error } = await supabase
      .from('chapters')
      .update({
        title,
        description: description || null,
        order_index: order_index ?? 0,
        is_published: is_published ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Failed to update chapter:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het bijwerken van het hoofdstuk' },
      { status: 500 }
    )
  }
}

// DELETE chapter
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Hoofdstuk verwijderd' })
  } catch (error) {
    console.error('Failed to delete chapter:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwijderen van het hoofdstuk' },
      { status: 500 }
    )
  }
}
