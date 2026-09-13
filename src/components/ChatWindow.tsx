import type { ChatMessage } from '../lib/storage'

type Props = {
  messages: ChatMessage[]
  typingMessageId: string | null
  typingText: string
}

export default function ChatWindow({ messages, typingMessageId, typingText }: Props) {
  return (
    <div className="chat-window">
      {messages.map((message) => {
        const isTyping = message.id === typingMessageId

        return (
          <div
            key={message.id}
            className={`message ${message.role === 'assistant' ? 'message-ai' : 'message-user'}`}
          >
            <span className="speaker">
              {message.role === 'assistant' ? 'AI' : 'You'}
            </span>
            <p>{isTyping ? typingText : message.content}</p>
          </div>
        )
      })}
    </div>
  )
}