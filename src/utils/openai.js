import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function processImageWithChatGPT(base64Image, prompt) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  try {
    // Удаляем префикс из base64 строки, если он есть
    const base64Data = base64Image.split(',')[1] || base64Image

    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // Используем модель GPT-4 с поддержкой Vision
      messages: [
        {
          role: 'system',
          content: 'Вы помощник, который анализирует изображения и отвечает на вопросы о них. Будьте информативны и точны в своих ответах.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Data}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error(`Ошибка OpenAI API: ${error.message}`)
  }
}