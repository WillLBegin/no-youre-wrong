import './TopicBanner.css'

function TopicBanner({ topic }) {
  return (
    <div className="topic-banner">
      <span className="topic-label">Today's Debate</span>
      <h2 className="topic-text">{topic}</h2>
    </div>
  )
}

export default TopicBanner
