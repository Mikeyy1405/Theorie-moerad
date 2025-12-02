import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/admin-auth'
import { callOpenAI } from '@/lib/openai'

export const dynamic = 'force-dynamic'

interface GeneratedAnswer {
  text: string
  isCorrect: boolean
}

interface GeneratedQuestion {
  question: string
  answers: GeneratedAnswer[]
  explanation: string
}

interface GeneratedLesson {
  title: string
  type: 'TEXT' | 'QUIZ'
  content?: string
}

interface GeneratedQuiz {
  title: string
  questions: GeneratedQuestion[]
}

interface GeneratedLessonsResponse {
  lessons: GeneratedLesson[]
  quiz?: GeneratedQuiz
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error

    const body = await request.json()
    const { chapterId, chapterTitle, courseTitle, lessonCount = 3, includeQuiz = false, prompt } = body

    if (!chapterId || !chapterTitle) {
      return NextResponse.json(
        { error: 'Hoofdstuk ID en titel zijn verplicht' },
        { status: 400 }
      )
    }

    const numLessons = Math.min(Math.max(1, lessonCount), 10)

    const systemPrompt = `Je bent een expert theorie-instructeur voor rijexamens in Nederland.
Genereer lessen voor het hoofdstuk: "${chapterTitle}"
${courseTitle ? `Cursus: ${courseTitle}` : ''}

Genereer ${numLessons} lessen met:
- Duidelijke titels
- Uitgebreide theorie content (500-1000 woorden per les)
- Praktische voorbeelden
- Tips voor het examen
- Gebruik Markdown formatting voor structuur (## voor kopjes, - voor bullets, etc.)

${includeQuiz ? `Voeg ook een quiz toe met 10 vragen, elk met 4 antwoordopties en uitleg.

De quiz moet bevatten:
- Een titel (bijv. "Quiz: ${chapterTitle}")
- 10 vragen met elk 4 antwoordopties
- Precies 1 correct antwoord per vraag
- Een uitleg voor elke vraag` : ''}

${prompt ? `Extra instructies: ${prompt}` : ''}

Antwoord ALLEEN met valid JSON in dit formaat:
{
  "lessons": [
    {
      "title": "Les titel",
      "type": "TEXT",
      "content": "Volledige les content in Markdown..."
    }
  ]${includeQuiz ? `,
  "quiz": {
    "title": "Quiz: ${chapterTitle}",
    "questions": [
      {
        "question": "De vraag tekst?",
        "answers": [
          {"text": "Antwoord A", "isCorrect": false},
          {"text": "Antwoord B", "isCorrect": true},
          {"text": "Antwoord C", "isCorrect": false},
          {"text": "Antwoord D", "isCorrect": false}
        ],
        "explanation": "Uitleg waarom B correct is..."
      }
    ]
  }` : ''}
}`

    const content = await callOpenAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Genereer ${numLessons} theorie lessen${includeQuiz ? ' en een quiz' : ''} voor het hoofdstuk "${chapterTitle}".` },
      ],
      { maxTokens: 8000, temperature: 0.7 }
    )

    // Try to parse the JSON response
    let result: GeneratedLessonsResponse
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      result = JSON.parse(cleanContent)
      
      if (!result.lessons || !Array.isArray(result.lessons)) {
        throw new Error('Response does not contain lessons array')
      }

      // Validate lessons structure
      result.lessons = result.lessons.filter(lesson => 
        lesson.title && 
        lesson.type && 
        (lesson.type === 'TEXT' ? lesson.content : true)
      )

      // Validate quiz structure if present
      if (result.quiz) {
        if (!result.quiz.questions || !Array.isArray(result.quiz.questions)) {
          result.quiz = undefined
        } else {
          result.quiz.questions = result.quiz.questions.filter(q =>
            q.question &&
            Array.isArray(q.answers) &&
            q.answers.length >= 2 &&
            q.answers.some(a => a.isCorrect)
          )
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json(
        { error: 'AI response kon niet worden verwerkt. Probeer het opnieuw.' },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to generate lessons:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het genereren van de lessen' },
      { status: 500 }
    )
  }
}
