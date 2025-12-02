import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/admin-auth'

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

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Schrijf een theorie les over: ${topic}` }
        ],
        max_tokens: 3000,
        temperature: 0.7
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI API error:', errorText)
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

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
