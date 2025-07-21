import React, { useState, useEffect } from 'react';
import './App.css';

/*
Tic Tac Toe colors spec:
  accent: #FFEB3B
  primary: #1976D2
  secondary: #424242
Theme: light, minimalistic style.
*/

/* UTILITY: Returns the winner (X/O/null), or 'tie' if tie, null otherwise. */
function calculateWinner(squares) {
  // Lines: 3 rows, 3 cols, 2 diags
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) return squares[a];
  }
  if (squares.every(v => v)) return 'tie';
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Theme management for accessibility, but always starts on light
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Game State
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState({winner: null, message: "Player X's turn"});

  // On square click
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (squares[idx] || status.winner) return;
    const newSquares = squares.slice();
    newSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setStatus({winner: null, message: "Player X's turn"});
  }

  // Win/tie detection
  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner === 'X' || winner === 'O') {
      setStatus({winner, message: `🎉 Player ${winner} wins!`});
    } else if (winner === 'tie') {
      setStatus({winner: 'tie', message: "🤝 It's a tie!"});
    } else {
      setStatus({winner: null, message: `Player ${xIsNext ? 'X' : 'O'}'s turn`});
    }
  }, [squares, xIsNext]);

  // Board renderer
  function renderSquare(idx) {
    return (
      <button
        className="ttt-square"
        aria-label={`Mark cell ${idx+1} as ${xIsNext ? 'X' : 'O'}`}
        key={idx}
        onClick={() => handleClick(idx)}
        disabled={!!squares[idx] || !!status.winner}
        tabIndex={0}
      >
        {squares[idx]}
      </button>
    );
  }

  // CSS variables for theme
  useEffect(() => {
    // Override theme colors with TicTacToe brand palette
    document.documentElement.style.setProperty('--ttt-primary', '#1976D2');
    document.documentElement.style.setProperty('--ttt-secondary', '#424242');
    document.documentElement.style.setProperty('--ttt-accent', '#FFEB3B');
    document.documentElement.style.setProperty('--ttt-bg', theme === 'light' ? '#fff' : '#212121');
    document.documentElement.style.setProperty('--ttt-text', theme === 'light' ? '#222' : '#fafafa');
    document.documentElement.style.setProperty('--ttt-board-bg', theme === 'light' ? '#f7f9fa' : '#333');
    document.documentElement.style.setProperty('--ttt-btn-bg', '#1976D2');
    document.documentElement.style.setProperty('--ttt-btn-text', '#fff');
  }, [theme]);

  return (
    <div className="App ttt-root" style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--ttt-bg)", color: "var(--ttt-text)"
    }}>
      <div className="ttt-container">
        <header className="ttt-header">
          <h1 className="ttt-title" style={{
            color: 'var(--ttt-primary)', fontWeight: 900, marginBottom: 8
          }}>Tic Tac Toe</h1>
          <p className="ttt-turn-indicator"
            style={{
              color: status.winner==='tie'?
                  'var(--ttt-secondary)'
                : status.winner
                  ? 'var(--ttt-accent)'
                  : xIsNext 
                    ? 'var(--ttt-primary)'
                    : 'var(--ttt-secondary)',
              fontWeight: 600, fontSize: 20,
              minHeight: '2em'
            }}>
            {status.message}
          </p>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{position:'absolute',right:24,top:24}}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </header>
        <main>
          <div
            className="ttt-board"
            style={{
              display:'grid',
              gridTemplateColumns: "repeat(3, 60px)",
              gridTemplateRows: "repeat(3, 60px)",
              gap: 5,
              margin: "24px auto",
              background: "var(--ttt-board-bg)",
              borderRadius: 16,
              boxShadow: '0 2px 16px rgba(40, 76, 100, 0.07)'
            }}
          >
            {Array(9).fill(null).map((_, i) => renderSquare(i))}
          </div>
        </main>
        <footer className="ttt-footer" style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 16,
        }}>
          <button
            className="ttt-restart-btn"
            style={{
              background: 'var(--ttt-accent)',
              color: '#222',
              border: 'none',
              borderRadius: 8,
              padding: '10px 28px',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '1px',
              marginBottom: 4,
              boxShadow: status.winner ? '0 2px 6px rgba(255,235,59,.15)' : 'none',
              cursor: 'pointer',
              outline: 0
            }}
            onClick={restartGame}
            tabIndex={0}
            aria-label="Restart game"
          >
            {status.winner ? 'Play Again' : 'Restart'}
          </button>
          <div style={{fontSize:'14px', opacity:0.6, marginTop:8}}>
            Player X: <span style={{color:'var(--ttt-primary)',fontWeight:600}}>Blue</span> &nbsp; | &nbsp; Player O: <span style={{color:'var(--ttt-secondary)',fontWeight:600}}>Gray</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
