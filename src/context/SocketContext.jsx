import { createContext, useEffect, useState } from 'react'
import { getSocket } from '../lib/socket'

export const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const [socket] = useState(() => getSocket())

  useEffect(() => {
    socket.connect()
    return () => socket.disconnect()
  }, [socket])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
