import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAccess } from '@/lib/admin-auth'
import { callOpenAI } from '@/lib/openai'

export const dynamic = 'force-dynamic'

interface GeneratedChapter {
  title: string
  description: string
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminAccess()
    if (!auth.authorized) return auth.error

    const body = await request.json()
    const { prompt, courseTitle } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is verplicht' },
        { status: 400 }
      )
    }

    const systemPrompt = `Je bent een expert curriculum ontwerper voor rijschool theorie cursussen in Nederland.
Je taak is om een curriculum te genereren met hoofdstukken voor een theorie cursus.

Cursus: ${courseTitle || 'Theorie Cursus'}

Genereer een JSON array met hoofdstukken. Elk hoofdstuk moet bevatten:
- title: Een duidelijke, beknopte titel
- description: Een korte beschrijving van wat behandeld wordt (1-2 zinnen)

Antwoord ALLEEN met valid JSON, geen extra tekst. Voorbeeld formaat:
[
  {"title": "Verkeersborden", "description": "Leer alle belangrijke verkeersborden en hun betekenis."},
  {"title": "Voorrangsregels", "description": "De regels voor voorrang op kruispunten en rotondes."}
]`

    const content = await callOpenAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      { maxTokens: 2000, temperature: 0.7 }
    )

    // Try to parse the JSON response
    let chapters: GeneratedChapter[] = []
    try {
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      chapters = JSON.parse(cleanContent)
      
      if (!Array.isArray(chapters)) {
        throw new Error('Response is not an array')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      return NextResponse.json(
        { error: 'AI response kon niet worden verwerkt. Probeer het opnieuw.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ chapters })
  } catch (error) {
    console.error('Failed to generate curriculum:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het genereren van het curriculum' },
      { status: 500 }
    )
  }
}
