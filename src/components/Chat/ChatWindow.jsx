import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import './ChatWindow.css'

function ChatWindow({ messages, mySocketId }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <p className="chat-empty">No messages yet. Start the debate!</p>
      )}
      {messages.map((msg) => (
        <ChatMessage
          key={msg.id}
          message={msg}
          isSelf={msg.sender === mySocketId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatWindow
