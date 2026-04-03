import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>No, You're Wrong!</h1>
        <p className="tagline">Get matched. Get a topic. Argue it out.</p>
      </header>

      <main className="main">
        <div className="card">
          <div className="step">1</div>
          <h3>Get Matched</h3>
          <p>Paired with a random opponent in real time</p>
        </div>
        <div className="card">
          <div className="step">2</div>
          <h3>Get a Topic</h3>
          <p>Both players receive a random subject to debate</p>
        </div>
        <div className="card">
          <div className="step">3</div>
          <h3>Argue It Out</h3>
          <p>Make your case and prove them wrong</p>
        </div>
      </main>

      <button className="play-btn">Find an Opponent</button>

      <footer className="footer">
        <p>Built for fun. No hard feelings.</p>
      </footer>
    </div>
  )
}

export default App
