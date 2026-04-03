import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { getRandomTopic } from './topics.js'
import { addToQueue, removeFromQueue, tryMatch } from './matchmaking.js'
import { createDebate, getDebate, addMessage, removeDebate } from './debate.js'

const app = express()
app.use(cors())

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Track which debate each socket is in
const socketDebates = new Map()
// Track display names
const socketNames = new Map()

function generateName() {
  return `Debater #${Math.floor(1000 + Math.random() * 9000)}`
}

io.on('connection', (socket) => {
  const name = generateName()
  socketNames.set(socket.id, name)
  console.log(`${name} connected (${socket.id})`)

  socket.on('join-queue', () => {
    addToQueue(socket.id)
    console.log(`${name} joined the queue`)

    const match = tryMatch()
    if (match) {
      const [player1, player2] = match
      const topic = getRandomTopic()
      const debateId = crypto.randomUUID()
      createDebate(debateId, player1, player2, topic)

      // Track which debate each socket is in
      socketDebates.set(player1, debateId)
      socketDebates.set(player2, debateId)

      // Both sockets join the Socket.IO room
      const sock1 = io.sockets.sockets.get(player1)
      const sock2 = io.sockets.sockets.get(player2)
      if (sock1) sock1.join(debateId)
      if (sock2) sock2.join(debateId)

      const name1 = socketNames.get(player1)
      const name2 = socketNames.get(player2)

      console.log(`Match! ${name1} vs ${name2} — Topic: "${topic}"`)

      if (sock1) {
        sock1.emit('match-found', { debateId, topic, opponentName: name2 })
      }
      if (sock2) {
        sock2.emit('match-found', { debateId, topic, opponentName: name1 })
      }
    } else {
      socket.emit('waiting', { position: 1 })
    }
  })

  socket.on('leave-queue', () => {
    removeFromQueue(socket.id)
    console.log(`${name} left the queue`)
  })

  socket.on('join-debate', ({ debateId }) => {
    const debate = getDebate(debateId)
    if (!debate) return

    socket.join(debateId)
    const opponentId = debate.players.find((id) => id !== socket.id)
    const opponentName = socketNames.get(opponentId) || 'Unknown'

    socket.emit('debate-ready', {
      debateId,
      topic: debate.topic,
      opponent: opponentName,
      yourName: name,
      messages: debate.messages,
    })
  })

  socket.on('send-message', ({ debateId, text }) => {
    const debate = getDebate(debateId)
    if (!debate || !debate.players.includes(socket.id)) return

    const message = {
      id: crypto.randomUUID(),
      sender: socket.id,
      senderName: name,
      text,
      timestamp: Date.now(),
    }

    addMessage(debateId, message)
    io.to(debateId).emit('chat-message', message)
  })

  socket.on('typing', ({ debateId }) => {
    socket.to(debateId).emit('opponent-typing')
  })

  socket.on('disconnect', () => {
    console.log(`${name} disconnected (${socket.id})`)
    removeFromQueue(socket.id)
    socketNames.delete(socket.id)

    const debateId = socketDebates.get(socket.id)
    if (debateId) {
      socket.to(debateId).emit('opponent-disconnected')
      socketDebates.delete(socket.id)

      // Clean up debate if both players are gone
      const debate = getDebate(debateId)
      if (debate) {
        const otherPlayer = debate.players.find((id) => id !== socket.id)
        if (!socketDebates.has(otherPlayer)) {
          removeDebate(debateId)
          console.log(`Debate ${debateId} cleaned up`)
        }
      }
    }
  })
})

const PORT = 3001
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
