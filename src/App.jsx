import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import QueuePage from './pages/QueuePage'
import DebatePage from './pages/DebatePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/queue" element={<QueuePage />} />
      <Route path="/debate/:debateId" element={<DebatePage />} />
    </Routes>
  )
}

export default App
