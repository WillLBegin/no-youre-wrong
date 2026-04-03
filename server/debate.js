const debates = new Map()

export function createDebate(debateId, player1, player2, topic) {
  debates.set(debateId, {
    players: [player1, player2],
    topic,
    messages: [],
    createdAt: Date.now(),
  })
}

export function getDebate(debateId) {
  return debates.get(debateId)
}

export function addMessage(debateId, message) {
  const debate = debates.get(debateId)
  if (debate) {
    debate.messages.push(message)
  }
}

export function removeDebate(debateId) {
  debates.delete(debateId)
}
