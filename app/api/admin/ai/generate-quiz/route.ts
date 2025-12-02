import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/admin-auth'
import { callOpenAI } from '@/lib/openai'

export const dynamic = 'force-dynamic'

interface GeneratedAnswer {
  answer: string
  is_correct: boolean
}

interface GeneratedQuestion {
  question: string
  explanation: string
  answers: GeneratedAnswer[]
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error

    const body = await request.json()
    const { topic, numberOfQuestions = 5, lessonTitle } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Onderwerp is verplicht' },
        { status: 400 }
      )
    }

    const numQuestions = Math.min(Math.max(1, numberOfQuestions), 20)

    const systemPrompt = `Je bent een expert quiz maker voor rijschool theorie examens in Nederland.
Je taak is om realistische meerkeuze vragen te genereren voor theorie examens.

${lessonTitle ? `Les: ${lessonTitle}` : ''}

Genereer ${numQuestions} quiz vragen over het gegeven onderwerp.

Elke vraag moet bevatten:
- question: De vraag tekst
- explanation: Uitleg waarom het correcte antwoord juist is
- answers: Array van 4 antwoorden, elk met:
  - answer: De antwoord tekst
  - is_correct: true voor het juiste antwoord, false voor foute antwoorden

Regels:
- Precies 1 antwoord per vraag moet correct zijn
- Elk antwoord moet 4 opties hebben
- Vragen moeten relevant zijn voor het Nederlandse theorie examen
- Antwoorden moeten realistisch en niet te voor de hand liggend zijn

Antwoord ALLEEN met valid JSON array, geen extra tekst. Voorbeeld:
[
  {
    "question": "Wat is de maximumsnelheid binnen de bebouwde kom?",
    "explanation": "Binnen de bebouwde kom geldt een maximumsnelheid van 50 km/u, tenzij anders aangegeven.",
    "answers": [
      {"answer": "30 km/u", "is_correct": false},
      {"answer": "50 km/u", "is_correct": true},
      {"answer": "70 km/u", "is_correct": false},
      {"answer": "80 km/u", "is_correct": false}
    ]
  }
]`

    const content = await callOpenAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Genereer ${numQuestions} quiz vragen over: ${topic}` },
      ],
      { maxTokens: 4000, temperature: 0.7 }
    )

    // Try to parse the JSON response
    let questions: GeneratedQuestion[] = []
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      questions = JSON.parse(cleanContent)
      
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array')
      }

      // Validate structure
      questions = questions.filter(q => 
        q.question && 
        Array.isArray(q.answers) && 
        q.answers.length >= 2 &&
        q.answers.some(a => a.is_correct)
      )
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json(
        { error: 'AI response kon niet worden verwerkt. Probeer het opnieuw.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Failed to generate quiz:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het genereren van de quiz vragen' },
      { status: 500 }
    )
  }
}
