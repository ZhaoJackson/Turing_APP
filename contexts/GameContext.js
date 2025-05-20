import { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [gameMode, setGameMode] = useState('normal'); // 'normal' or 'timeAttack'
  const [timeLimit, setTimeLimit] = useState(60); // 60 seconds per question
  const [responseTimes, setResponseTimes] = useState([]);
  const [themeStats, setThemeStats] = useState({});
  const [personalBest, setPersonalBest] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [leaderboard, setLeaderboard] = useState([]);
  const [comments, setComments] = useState({});

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      const { darkMode: savedDarkMode, fontSize: savedFontSize } = JSON.parse(savedSettings);
      setDarkMode(savedDarkMode);
      setFontSize(savedFontSize);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify({ darkMode, fontSize }));
  }, [darkMode, fontSize]);

  // Update theme stats
  const updateThemeStats = (theme, correct, startTime) => {
    const currentTime = Date.now();
    const responseTime = (currentTime - startTime) / 1000;

    setThemeStats(prev => ({
      ...prev,
      [theme]: {
        total: (prev[theme]?.total || 0) + 1,
        correct: (prev[theme]?.correct || 0) + (correct ? 1 : 0),
        avgResponseTime: prev[theme]?.avgResponseTime 
          ? ((prev[theme].avgResponseTime * prev[theme].total) + responseTime) / (prev[theme].total + 1)
          : responseTime,
        lastPlayed: new Date().toISOString()
      }
    }));
  };

  // Update response time
  const addResponseTime = (time) => {
    setResponseTimes(prev => [...prev, time]);
  };

  // Calculate average response time
  const getAverageResponseTime = () => {
    if (responseTimes.length === 0) return 0;
    return responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  };

  // Get theme statistics
  const getThemeStats = () => {
    return Object.entries(themeStats)
      .map(([theme, stats]) => ({
        theme,
        accuracy: stats.correct / stats.total,
        totalAttempts: stats.total,
        avgResponseTime: stats.avgResponseTime,
        lastPlayed: stats.lastPlayed
      }))
      .sort((a, b) => b.totalAttempts - a.totalAttempts);
  };

  // Add to leaderboard
  const addToLeaderboard = (score, time) => {
    const newEntry = {
      id: Date.now(),
      score,
      time,
      date: new Date().toISOString()
    };
    setLeaderboard(prev => [...prev, newEntry].sort((a, b) => b.score - a.score).slice(0, 10));
  };

  // Add comment
  const addComment = (promptId, comment) => {
    setComments(prev => ({
      ...prev,
      [promptId]: [...(prev[promptId] || []), {
        id: Date.now(),
        text: comment,
        date: new Date().toISOString()
      }]
    }));
  };

  return (
    <GameContext.Provider value={{
      darkMode,
      setDarkMode,
      gameMode,
      setGameMode,
      timeLimit,
      setTimeLimit,
      fontSize,
      setFontSize,
      responseTimes,
      addResponseTime,
      getAverageResponseTime,
      themeStats,
      updateThemeStats,
      getThemeStats,
      personalBest,
      setPersonalBest,
      leaderboard,
      addToLeaderboard,
      comments,
      addComment
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 