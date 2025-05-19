import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const mockData = [
  {
    prompt: "What's the meaning of life?",
    responses: [
      { text: "To create your own purpose through love and learning.", source: "human" },
      { text: "The meaning of life is a philosophical concept, often interpreted as 42.", source: "ai" }
    ]
  },
  {
    prompt: "How do I improve my mental health?",
    responses: [
      { text: "Regular exercise, connection with others, and therapy can help a lot.", source: "human" },
      { text: "Improving mental health involves managing stress and seeking professional help.", source: "ai" }
    ]
  }
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSwipe = (response, dir) => {
    const correct = mockData[index].responses.find(r => r.source === 'human');
    if (response.text === correct.text) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (index + 1 >= mockData.length) setFinished(true);
      else setIndex(index + 1);
    }, 300);
  };

  if (finished) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <h1>🎉 Game Over</h1>
        <p>Your score: {score}/{mockData.length}</p>
      </div>
    );
  }

  const current = mockData[index];

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <h2>Who wrote it: Human or AI?</h2>
      <p><strong>Prompt:</strong> {current.prompt}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 30 }}>
        <AnimatePresence>
          {current.responses.map((response, idx) => (
            <motion.div
              key={idx}
              drag='x'
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) handleSwipe(response, 'right');
                if (info.offset.x < -100) handleSwipe(response, 'left');
              }}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{
                width: 250,
                padding: 20,
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: 12,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {response.text}
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
