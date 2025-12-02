import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// GET quiz answers (filter by question_id)
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('question_id')
    
    let query = supabase
      .from('quiz_answers')
      .select('*')
    
    if (questionId) {
      query = query.eq('question_id', questionId)
    }
    
    const { data: answers, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(answers)
  } catch (error) {
    console.error('Failed to fetch quiz answers:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van quiz antwoorden' },
      { status: 500 }
    )
  }
}

// POST create new quiz answer
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { question_id, answer, is_correct } = body
    
    if (!question_id || !answer) {
      return NextResponse.json(
        { error: 'Vraag ID en antwoord zijn verplicht' },
        { status: 400 }
      )
    }
    
    const { data: quizAnswer, error } = await supabase
      .from('quiz_answers')
      .insert({
        question_id,
        answer,
        is_correct: is_correct ?? false,
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(quizAnswer, { status: 201 })
  } catch (error) {
    console.error('Failed to create quiz answer:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van het quiz antwoord' },
      { status: 500 }
    )
  }
}
