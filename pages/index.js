import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { data } from '../data/turing_data';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [responses, setResponses] = useState([]);

  const current = data[index];

  useEffect(() => {
    if (current) {
      const shuffled = Math.random() > 0.5
        ? [current.human, current.ai]
        : [current.ai, current.human];
      setResponses(shuffled);
    }
  }, [index]);

  const handleSwipe = (selectedText) => {
    if (selectedText === current.human) {
      setScore(score + 1);
    }
    const nextIndex = index + 1;
    if (nextIndex >= data.length) {
      setFinished(true);
    } else {
      setIndex(nextIndex);
    }
  };

  if (finished) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <h1>🎉 Game Over</h1>
        <p>Your score: {score} / {data.length}</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Who wrote it: Human or AI?</h2>
      <p><strong>Prompt:</strong> {current.prompt}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 30 }}>
        <AnimatePresence>
          {responses.length > 0 && responses.map((response, idx) => (
            <motion.div
              key={idx}
              drag="x"
              onDragEnd={(e, info) => {
                if (info.offset.x > 100 || info.offset.x < -100) {
                  handleSwipe(response);
                }
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{
                width: 300,
                padding: 20,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 12,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                cursor: 'grab'
              }}
            >
              {response}
              <p style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
                Swipe right if you think this is human
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}