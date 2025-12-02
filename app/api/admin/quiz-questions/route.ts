import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { verifyAdminAccess } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET quiz questions (filter by lesson_id)
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const lessonId = searchParams.get('lesson_id')
    
    let query = supabase
      .from('quiz_questions')
      .select('*, quiz_answers(*)')
      .order('order_index', { ascending: true })
    
    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }
    
    const { data: questions, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Failed to fetch quiz questions:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van quiz vragen' },
      { status: 500 }
    )
  }
}

// POST create new quiz question
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error
    
    const supabase = createAdminClient()
    const body = await request.json()
    
    const { lesson_id, question, image_url, explanation, order_index } = body
    
    if (!lesson_id || !question) {
      return NextResponse.json(
        { error: 'Les ID en vraag zijn verplicht' },
        { status: 400 }
      )
    }
    
    // Get the next order_index if not provided
    let orderIdx = order_index
    if (orderIdx === undefined || orderIdx === null) {
      const { data: existingQuestions } = await supabase
        .from('quiz_questions')
        .select('order_index')
        .eq('lesson_id', lesson_id)
        .order('order_index', { ascending: false })
        .limit(1)
      
      orderIdx = existingQuestions && existingQuestions.length > 0
        ? existingQuestions[0].order_index + 1
        : 0
    }
    
    const { data: quizQuestion, error } = await supabase
      .from('quiz_questions')
      .insert({
        lesson_id,
        question,
        image_url: image_url || null,
        explanation: explanation || null,
        order_index: orderIdx,
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(quizQuestion, { status: 201 })
  } catch (error) {
    console.error('Failed to create quiz question:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de quiz vraag' },
      { status: 500 }
    )
  }
}
