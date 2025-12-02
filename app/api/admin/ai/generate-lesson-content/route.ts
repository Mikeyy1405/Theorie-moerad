import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/admin-auth'
import { callOpenAI } from '@/lib/openai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error

    const body = await request.json()
    const { topic, chapterTitle, courseTitle } = body

    if (!topic) {
      return NextResponse.json(
        { error: 'Onderwerp is verplicht' },
        { status: 400 }
      )
    }

    const systemPrompt = `Je bent een expert content schrijver voor rijschool theorie cursussen in Nederland.
Je taak is om educatieve tekst te schrijven voor theorie lessen.

${courseTitle ? `Cursus: ${courseTitle}` : ''}
${chapterTitle ? `Hoofdstuk: ${chapterTitle}` : ''}

Schrijf een duidelijke, informatieve les tekst over het gegeven onderwerp.
De tekst moet:
- Geschikt zijn voor studenten die hun rijbewijs halen
- Duidelijk en begrijpelijk zijn
- Praktische voorbeelden bevatten waar relevant
- Gestructureerd zijn met kopjes waar nodig
- In het Nederlands zijn

Gebruik Markdown formatting voor structuur (## voor kopjes, - voor bullets, etc.).`

    const content = await callOpenAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Schrijf een theorie les over: ${topic}` },
      ],
      { maxTokens: 3000, temperature: 0.7 }
    )

    if (!content) {
      return NextResponse.json(
        { error: 'AI heeft geen content gegenereerd. Probeer het opnieuw.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Failed to generate lesson content:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het genereren van de les content' },
      { status: 500 }
    )
  }
}
