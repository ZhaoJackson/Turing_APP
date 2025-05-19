// pages/index.js

import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20vh', padding: 20 }}>
      <h1>🤖 Turing Test Game</h1>
      <p>Can you tell which response was written by a human and which one by AI?</p>
      <p>Swipe right if you think it's human. Swipe left if you think it's AI.</p>

      <Link href="/game">
        <button style={{
          marginTop: 40,
          padding: '12px 24px',
          fontSize: '1rem',
          borderRadius: '8px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}>
          ▶ Start Game
        </button>
      </Link>
    </div>
  );
}