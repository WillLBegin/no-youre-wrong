import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import './QueuePage.css'

function QueuePage() {
  const socket = useSocket()
  const navigate = useNavigate()

  useEffect(() => {
    if (!socket) return

    socket.emit('join-queue')

    function onMatchFound({ debateId }) {
      navigate(`/debate/${debateId}`)
    }

    socket.on('match-found', onMatchFound)

    return () => {
      socket.off('match-found', onMatchFound)
      socket.emit('leave-queue')
    }
  }, [socket, navigate])

  function handleCancel() {
    navigate('/')
  }

  return (
    <div className="queue-page">
      <div className="queue-content">
        <div className="spinner">
          <div className="dot dot1"></div>
          <div className="dot dot2"></div>
          <div className="dot dot3"></div>
        </div>
        <h2>Looking for an opponent...</h2>
        <p className="queue-sub">Hang tight, we're finding someone to argue with you.</p>
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export default QueuePage
