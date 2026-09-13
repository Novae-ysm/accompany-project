import { getTTSAudio } from './lib/api'

let currentAudio: HTMLAudioElement | null = null

export function startSpeechRecognition(onResult: (text: string) => void, onEnd: () => void) {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    alert('Your browser does not support speech recognition. Please use Chrome.')
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript
    onResult(text)
  }

  recognition.onend = () => {
    onEnd()
  }

  recognition.onerror = () => {
    onEnd()
  }

  recognition.start()
}

export function stopSpeechRecognition() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }

  window.speechSynthesis.cancel()
}

export async function speakText(text: string, enabled: boolean) {
  if (!enabled || !text.trim()) return

  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }

  const cleanText = text
    .replace(/（[^）]*）/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/【[^】]*】/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/[#*_~`>]/g, '')
    .trim()

  if (!cleanText) return

  try {
    const url = await getTTSAudio(cleanText)
    const audio = new Audio(url)
    currentAudio = audio
    audio.load()
    await audio.play()
  } catch {
    // 静默失败
  }
}