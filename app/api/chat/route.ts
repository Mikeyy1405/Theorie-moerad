
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Bericht is verplicht' },
        { status: 400 }
      )
    }

    const messages = [
      {
        role: 'system',
        content: 'Je bent een behulpzame AI-assistent voor het TheorieExamen platform. Je helpt Nederlandse studenten met vragen over autorijbewijs en motorrijbewijs theorie-examens. Geef korte, duidelijke antwoorden in het Nederlands. Focus op praktische tips en uitleg over verkeersregels, verkeersborden, en examen voorbereiding.'
      },
      {
        role: 'user',
        content: message
      }
    ]

    // Note: This route uses streaming which requires direct fetch instead of the callOpenAI helper
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        stream: true,
        max_tokens: 1000,
        temperature: 0.7
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }
        
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()
        
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value)
            controller.enqueue(encoder.encode(chunk))
          }
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het verwerken van je vraag' },
      { status: 500 }
    )
  }
}
