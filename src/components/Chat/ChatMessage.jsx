import './ChatMessage.css'

function ChatMessage({ message, isSelf }) {
  return (
    <div className={`chat-message ${isSelf ? 'self' : 'opponent'}`}>
      <span className="message-name">{message.senderName}</span>
      <div className="message-bubble">
        <p>{message.text}</p>
      </div>
    </div>
  )
}

export default ChatMessage
