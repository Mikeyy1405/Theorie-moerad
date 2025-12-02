import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// GET single quiz answer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient()
    
    const { data: answer, error } = await supabase
      .from('quiz_answers')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Quiz antwoord niet gevonden' },
          { status: 404 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(answer)
  } catch (error) {
    console.error('Failed to fetch quiz answer:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van het quiz antwoord' },
      { status: 500 }
    )
  }
}

// PUT update quiz answer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { answer, is_correct } = body
    
    if (!answer) {
      return NextResponse.json(
        { error: 'Antwoord is verplicht' },
        { status: 400 }
      )
    }
    
    const { data: quizAnswer, error } = await supabase
      .from('quiz_answers')
      .update({
        answer,
        is_correct: is_correct ?? false,
      })
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(quizAnswer)
  } catch (error) {
    console.error('Failed to update quiz answer:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het bijwerken van het quiz antwoord' },
      { status: 500 }
    )
  }
}

// DELETE quiz answer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createAdminClient()
    
    const { error } = await supabase
      .from('quiz_answers')
      .delete()
      .eq('id', params.id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ message: 'Quiz antwoord verwijderd' })
  } catch (error) {
    console.error('Failed to delete quiz answer:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwijderen van het quiz antwoord' },
      { status: 500 }
    )
  }
}
