export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}

const STORAGE_KEY = 'accompany-chat-histories'

export type ChatHistoryMap = {
  [characterId: string]: ChatMessage[]
}

export function loadAllHistories(): ChatHistoryMap {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as ChatHistoryMap
  } catch {
    return {}
  }
}

export function loadMessages(characterId: string): ChatMessage[] {
  const histories = loadAllHistories()
  return histories[characterId] ?? []
}

export function saveMessages(characterId: string, messages: ChatMessage[]) {
  const histories = loadAllHistories()
  histories[characterId] = messages
  localStorage.setItem(STORAGE_KEY, JSON.stringify(histories))
}

export function clearMessages(characterId: string) {
  const histories = loadAllHistories()
  delete histories[characterId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(histories))
}