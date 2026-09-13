type LLMSettings = {
  apiKey: string
  baseUrl: string
  model: string
}

export async function sendChat(
  messages: { role: string; content: string }[],
  settings?: LLMSettings
) {
  const response = await fetch('http://localhost:3001/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, settings }),
  })

  if (!response.ok) {
    throw new Error('Failed to get AI response')
  }

  const data = await response.json()
  return data.reply as string
}

export async function getTTSAudio(text: string): Promise<string> {
  const response = await fetch('http://localhost:3001/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    throw new Error('Failed to get TTS audio')
  }

  const data = await response.json()
  return `${data.url}?t=${Date.now()}`
}