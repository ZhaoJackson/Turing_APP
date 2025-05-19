import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { data } from '../data/turing_data';

const getUniqueConditions = () => {
  const all = data.map(item => item.condition?.trim() || 'Uncategorized');
  return Array.from(new Set(all));
};

export default function Game() {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [shuffledData, setShuffledData] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [responseToShow, setResponseToShow] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const conditions = getUniqueConditions();

  const startGame = () => {
    const filtered = selectedTheme
      ? data.filter(item => item.condition?.trim() === selectedTheme)
      : data;

    const selected = [...filtered]
      .filter(item => item.prompt && item.human && item.ai)
      .sort(() => Math.random() - 0.5)
      .slice(0, 15);

    setShuffledData(selected);
    setIndex(0);
    setScore(0);
    setFinished(false);
    setCurrentItem(null);
    setResponseToShow(null);
    setGameStarted(true);
  };

  useEffect(() => {
    if (shuffledData.length > 0 && index < shuffledData.length) {
      const item = shuffledData[index];
      const showHuman = Math.random() > 0.5;
      setCurrentItem(item);
      setResponseToShow(showHuman ? item.human : item.ai);
    } else if (shuffledData.length > 0 && index >= shuffledData.length) {
      setFinished(true);
    }
  }, [shuffledData, index]);

  const handleSwipe = (direction) => {
    if (!currentItem || !responseToShow) return;

    const isHuman = responseToShow === currentItem.human;
    const correctGuess = (direction === 'right' && isHuman) || (direction === 'left' && !isHuman);

    if (correctGuess) setScore(prev => prev + 1);
    setIndex(prev => prev + 1);
  };

  if (!gameStarted) {
    return (
      <div style={{ textAlign: 'center', marginTop: '15vh' }}>
        <h2>Select a Condition to Begin</h2>
        <select
          value={selectedTheme}
          onChange={(e) => setSelectedTheme(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 8, marginTop: 20 }}
        >
          <option value=''>All Topics</option>
          {conditions.map((cond, idx) => (
            <option key={idx} value={cond}>{cond}</option>
          ))}
        </select>
        <br />
        <button
          onClick={startGame}
          style={{
            marginTop: 30,
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '8px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ▶ Start Game
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <h1>🎉 Game Over</h1>
        <p>Your score: {score} / {shuffledData.length}</p>
        <button
          onClick={() => {
            setGameStarted(false);
            setSelectedTheme('');
          }}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '8px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🔁 Retry & Choose New Theme
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Guess: Human or AI?</h2>
      {currentItem && (
        <>
          <p><strong>Prompt:</strong> {currentItem.prompt}</p>
          <p style={{ color: '#999' }}>Question {index + 1} of {shuffledData.length}</p>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <AnimatePresence>
          {responseToShow && (
            <motion.div
              key={index}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) handleSwipe('right');
                else if (info.offset.x < -100) handleSwipe('left');
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{
                width: 400,
                padding: 20,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 12,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                cursor: 'grab'
              }}
            >
              {responseToShow}
              <p style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
                Swipe → if Human, ← if AI
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
