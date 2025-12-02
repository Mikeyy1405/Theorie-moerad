import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyAdminAccess } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET single quiz question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    
    const { data: question, error } = await supabase
      .from('quiz_questions')
      .select('*, quiz_answers(*)')
      .eq('id', params.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Quiz vraag niet gevonden' },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(question)
  } catch (error) {
    console.error('Failed to fetch quiz question:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van de quiz vraag' },
      { status: 500 }
    )
  }
}

// PUT update quiz question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { question, image_url, explanation, order_index } = body
    
    if (!question) {
      return NextResponse.json(
        { error: 'Vraag is verplicht' },
        { status: 400 }
      )
    }
    
    const { data: quizQuestion, error } = await supabase
      .from('quiz_questions')
      .update({
        question,
        image_url: image_url || null,
        explanation: explanation || null,
        order_index: order_index ?? 0,
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(quizQuestion)
  } catch (error) {
    console.error('Failed to update quiz question:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het bijwerken van de quiz vraag' },
      { status: 500 }
    )
  }
}

// DELETE quiz question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Quiz vraag verwijderd' })
  } catch (error) {
    console.error('Failed to delete quiz question:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwijderen van de quiz vraag' },
      { status: 500 }
    )
  }
}
