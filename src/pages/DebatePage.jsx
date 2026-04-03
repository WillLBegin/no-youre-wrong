import { useEffect, useReducer, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import TopicBanner from '../components/TopicBanner'
import ChatWindow from '../components/Chat/ChatWindow'
import ChatInput from '../components/Chat/ChatInput'
import './DebatePage.css'

function messagesReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, action.message]
    case 'init':
      return action.messages
    default:
      return state
  }
}

function DebatePage() {
  const { debateId } = useParams()
  const socket = useSocket()
  const navigate = useNavigate()
  const [messages, dispatch] = useReducer(messagesReducer, [])
  const [topic, setTopic] = useState('')
  const [opponent, setOpponent] = useState('')
  const [myName, setMyName] = useState('')
  const [opponentDisconnected, setOpponentDisconnected] = useState(false)

  useEffect(() => {
    if (!socket) return

    socket.emit('join-debate', { debateId })

    function onDebateReady(data) {
      setTopic(data.topic)
      setOpponent(data.opponent)
      setMyName(data.yourName)
      if (data.messages?.length) {
        dispatch({ type: 'init', messages: data.messages })
      }
    }

    function onChatMessage(message) {
      dispatch({ type: 'add', message })
    }

    function onOpponentDisconnected() {
      setOpponentDisconnected(true)
    }

    socket.on('debate-ready', onDebateReady)
    socket.on('chat-message', onChatMessage)
    socket.on('opponent-disconnected', onOpponentDisconnected)

    return () => {
      socket.off('debate-ready', onDebateReady)
      socket.off('chat-message', onChatMessage)
      socket.off('opponent-disconnected', onOpponentDisconnected)
    }
  }, [socket, debateId])

  function handleSend(text) {
    socket.emit('send-message', { debateId, text })
  }

  function handleLeave() {
    socket.emit('leave-debate', { debateId })
    navigate('/')
  }

  return (
    <div className="debate-page">
      <TopicBanner topic={topic || 'Loading...'} />
      <div className="debate-header-bar">
        <span className="opponent-label">
          vs <strong>{opponent || '...'}</strong>
          {myName && <span className="you-label"> (You: {myName})</span>}
        </span>
        <button className="leave-btn" onClick={handleLeave}>Leave</button>
      </div>
      {opponentDisconnected && (
        <div className="disconnect-overlay">
          <div className="disconnect-modal">
            <h2>Your opponent left the debate</h2>
            <p>They were wrong.</p>
            <div className="disconnect-actions">
              <div className="disconnect-btn home" onClick={() => navigate('/')}>
                Home
              </div>
              <div className="disconnect-btn rematch" onClick={() => navigate('/queue')}>
                Queue again
              </div>
            </div>
          </div>
        </div>
      )}
      <ChatWindow messages={messages} mySocketId={socket?.id} />
      <ChatInput onSend={handleSend} disabled={opponentDisconnected} />
    </div>
  )
}

export default DebatePage
