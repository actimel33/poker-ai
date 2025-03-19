import { NextResponse } from 'next/server'
import { processImageWithChatGPT } from '@/utils/openai'

export async function POST(request) {
  try {
    const body = await request.json()
    const { image, prompt } = body

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image and prompt are required' },
        { status: 400 }
      )
    }

    // Базовая валидация данных
    if (!image.startsWith('data:image/')) {
      return NextResponse.json(
        { error: 'Invalid image format' },
        { status: 400 }
      )
    }

    const response = await processImageWithChatGPT(image, prompt)

    return NextResponse.json({ text: response })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}