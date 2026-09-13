import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const app = express()
const port = 3001
const execAsync = promisify(exec)

app.use(cors())
app.use(express.json())
app.use('/audio', express.static(path.join(process.cwd(), 'audio')))

app.post('/chat', async (req, res) => {
  const { messages, settings } = req.body

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' })
  }

  const apiKey = settings?.apiKey || process.env.LLM_API_KEY
  const baseUrl = settings?.baseUrl || process.env.LLM_BASE_URL
  const model = settings?.model || process.env.LLM_MODEL || 'deepseek-chat'

  if (!apiKey || !baseUrl) {
    return res.status(500).json({ error: 'Missing LLM API configuration' })
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    return res.status(500).json({ error: errorText })
  }

  const data = await response.json()
  const reply = data.choices?.[0]?.message?.content ?? ''

  res.json({ reply })
})

app.post('/tts', async (req, res) => {
  const { text } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' })
  }

  const cleanText = text
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/【[^】]*】/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/[#*_~`>]/g, '')
    .replace(/["\\]/g, '')
    .trim()

  if (!cleanText) {
    return res.status(400).json({ error: 'empty text after cleaning' })
  }

  const fileName = 'current-tts.mp3'
  const audioDir = path.join(process.cwd(), 'audio')
  const filePath = path.join(audioDir, fileName)

  fs.mkdirSync(audioDir, { recursive: true })

  const safeText = cleanText.replace(/'/g, "'\\''")
  const command = `python3 -m edge_tts --voice zh-CN-YunxiNeural --rate=-3% --pitch=-2Hz --text '${safeText}' --write-media ${filePath}`

  try {
    await execAsync(command)
    res.json({ url: `http://localhost:3001/audio/${fileName}` })
  } catch (error) {
    console.error('TTS error:', error)
    res.status(500).json({ error: 'TTS failed' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})