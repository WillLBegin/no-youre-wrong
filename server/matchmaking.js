const queue = []

export function addToQueue(socketId) {
  if (!queue.includes(socketId)) {
    queue.push(socketId)
  }
}

export function removeFromQueue(socketId) {
  const index = queue.indexOf(socketId)
  if (index !== -1) {
    queue.splice(index, 1)
  }
}

export function tryMatch() {
  if (queue.length >= 2) {
    const player1 = queue.shift()
    const player2 = queue.shift()
    return [player1, player2]
  }
  return null
}
