import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { data } from '../data/turing_data';
import { useGame } from '../contexts/GameContext';
import GameSettings from '../components/GameSettings';
import Comments from '../components/Comments';

const getUniqueConditions = () => {
  const all = data.map(item => item.condition?.trim() || 'Uncategorized');
  return Array.from(new Set(all));
};

export default function Game() {
  const {
    darkMode,
    gameMode,
    timeLimit,
    fontSize,
    addResponseTime,
    updateThemeStats,
    personalBest,
    setPersonalBest,
    addToLeaderboard,
    setGameMode
  } = useGame();

  const [selectedTheme, setSelectedTheme] = useState('');
  const [shuffledData, setShuffledData] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [humanCorrect, setHumanCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [responseToShow, setResponseToShow] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [startTime, setStartTime] = useState(null);
  const [isHumanFirst, setIsHumanFirst] = useState(true);
  const timerRef = useRef(null);

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
    setHumanCorrect(0);
    setFinished(false);
    setCurrentItem(null);
    setResponseToShow(null);
    setGameStarted(true);
    setTimeLeft(timeLimit);
    setStartTime(Date.now());
  };

  // Handle timeout for each question
  useEffect(() => {
    if (gameStarted && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Force move to next question when time runs out
            if (currentItem && responseToShow) {
              setIndex(prev => prev + 1);
            }
            return timeLimit; // Reset to full time limit
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, finished, currentItem, responseToShow, timeLimit]);

  // Reset timer for new question
  useEffect(() => {
    if (shuffledData.length > 0 && index < shuffledData.length) {
      const item = shuffledData[index];
      const showHuman = Math.random() > 0.5;
      setCurrentItem(item);
      setResponseToShow(showHuman ? item.human : item.ai);
      setIsHumanFirst(Math.random() > 0.5);
      setTimeLeft(timeLimit);
      setStartTime(Date.now());
      
      // Clear and restart timer for new question
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Force move to next question when time runs out
            if (currentItem && responseToShow) {
              setIndex(prev => prev + 1);
            }
            return timeLimit;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (shuffledData.length > 0 && index >= shuffledData.length) {
      setFinished(true);
    }
  }, [shuffledData, index, timeLimit, currentItem, responseToShow]);

  const handleSwipe = (direction) => {
    if (!currentItem || !responseToShow) return;

    const isHuman = responseToShow === currentItem.human;
    const correctGuess = (direction === 'right' && isHuman) || (direction === 'left' && !isHuman);

    if (correctGuess) {
      setScore(prev => prev + 1);
      if (isHuman) {
        setHumanCorrect(prev => prev + 1);
      }
    }

    setIndex(prev => prev + 1);
  };

  const handleClick = (isFirstResponse) => {
    if (!currentItem) return;

    const isHuman = isFirstResponse ? isHumanFirst : !isHumanFirst;
    const correctGuess = isHuman;

    if (correctGuess) {
      setScore(prev => prev + 1);
      setHumanCorrect(prev => prev + 1);
    }

    setIndex(prev => prev + 1);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || finished) return;
      
      if (gameMode === 'swipe') {
        if (e.key === 'ArrowRight') handleSwipe('right');
        else if (e.key === 'ArrowLeft') handleSwipe('left');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, finished, currentItem, responseToShow, gameMode]);

  if (!gameStarted) {
    return (
      <div style={{ 
        position: 'relative',
        minHeight: '100vh',
        width: '100%'
      }}>
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000
        }}>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: '8px 16px',
              fontSize: `${fontSize * 0.8}px`,
              borderRadius: '8px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ⚙️ Settings
          </button>
        </div>
        {showSettings && <GameSettings onClose={() => setShowSettings(false)} />}
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '15vh',
          color: darkMode ? '#fff' : '#000',
          fontSize: `${fontSize}px`
        }}>
          <h2>Select a Condition to Begin</h2>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            style={{ 
              padding: 10, 
              fontSize: `${fontSize}px`, 
              borderRadius: 8, 
              marginTop: 20,
              background: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#000'
            }}
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
              fontSize: `${fontSize}px`,
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
      </div>
    );
  }

  if (finished) {
    return (
      <div style={{ 
        textAlign: 'center', 
        marginTop: 100,
        color: darkMode ? '#fff' : '#000',
        fontSize: `${fontSize}px`
      }}>
        <h1>🎉 Game Over</h1>
        <div style={{ marginTop: 20 }}>
          <p>Human Responses Correctly Identified: {humanCorrect} out of {shuffledData.length}</p>
        </div>
        <button
          onClick={() => {
            setGameStarted(false);
            setSelectedTheme('');
            setFinished(false);
            setShuffledData([]);
            setIndex(0);
            setScore(0);
            setHumanCorrect(0);
            setCurrentItem(null);
            setResponseToShow(null);
            setTimeLeft(timeLimit);
            setStartTime(null);
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
          }}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            fontSize: `${fontSize}px`,
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
    <div style={{ 
      textAlign: 'center', 
      padding: 20,
      color: darkMode ? '#fff' : '#000',
      fontSize: `${fontSize}px`
    }}>
      <h2>Guess: Human or AI?</h2>
      {currentItem && (
        <>
          <p><strong>Prompt:</strong> {currentItem.prompt}</p>
          <p style={{ color: '#999' }}>Question {index + 1} of {shuffledData.length}</p>
          <div className="timer-container" style={{
            margin: '10px 0',
            padding: '5px 10px',
            borderRadius: '4px',
            backgroundColor: timeLeft <= 10 ? '#ff4444' : '#666',
            color: '#fff',
            display: 'inline-block'
          }}>
            Time: {timeLeft}s / {timeLimit}s
          </div>
        </>
      )}

      {gameMode === 'swipe' ? (
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
                  background: darkMode ? '#333' : '#fff',
                  border: '1px solid #ddd',
                  borderRadius: 12,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  cursor: 'grab'
                }}
              >
                {responseToShow}
                <p style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
                  Swipe → if Human, ← if AI (or use arrow keys)
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: 40 }}>
          <AnimatePresence>
            {currentItem && (
              <>
                <motion.div
                  key={`response-1-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    width: 400,
                    padding: 20,
                    background: darkMode ? '#333' : '#fff',
                    border: '1px solid #ddd',
                    borderRadius: 12,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleClick(true)}
                >
                  {isHumanFirst ? currentItem.human : currentItem.ai}
                </motion.div>
                <motion.div
                  key={`response-2-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    width: 400,
                    padding: 20,
                    background: darkMode ? '#333' : '#fff',
                    border: '1px solid #ddd',
                    borderRadius: 12,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleClick(false)}
                >
                  {isHumanFirst ? currentItem.ai : currentItem.human}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
