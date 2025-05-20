import { useGame } from '../contexts/GameContext';

export default function GameSettings() {
  const {
    darkMode,
    setDarkMode,
    gameMode,
    setGameMode,
    timeLimit,
    setTimeLimit,
    fontSize,
    setFontSize,
    getAverageResponseTime,
    getThemeStats,
    personalBest,
    leaderboard
  } = useGame();

  return (
    <div className="settings-container">
      <h2>Game Settings</h2>
      
      {/* Theme Toggle */}
      <div className="setting-group">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          Dark Mode
        </label>
      </div>

      {/* Game Mode Selection */}
      <div className="setting-group">
        <label>Game Mode:</label>
        <select
          value={gameMode}
          onChange={(e) => setGameMode(e.target.value)}
        >
          <option value="normal">Normal Mode</option>
          <option value="timeAttack">Time Attack Mode</option>
        </select>
      </div>

      {/* Time Limit Setting */}
      {gameMode === 'timeAttack' && (
        <div className="setting-group">
          <label>Time Limit (seconds):</label>
          <input
            type="number"
            min="10"
            max="120"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
          />
        </div>
      )}

      {/* Font Size Adjustment */}
      <div className="setting-group">
        <label>Font Size:</label>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
        <span>{fontSize}px</span>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <h3>Statistics</h3>
        <div className="stat-item">
          <span>Average Response Time:</span>
          <span>{getAverageResponseTime().toFixed(2)}s</span>
        </div>
        <div className="stat-item">
          <span>Personal Best:</span>
          <span>{personalBest}</span>
        </div>

        {/* Theme Statistics */}
        <div className="theme-stats">
          <h4>Theme Statistics</h4>
          {getThemeStats().map(({ theme, accuracy, totalAttempts, avgResponseTime }) => (
            <div key={theme} className="theme-stat">
              <div className="theme-header">
                <span className="theme-name">{theme}</span>
              </div>
              <div className="theme-details">
                <div>Accuracy: {(accuracy * 100).toFixed(1)}%</div>
                <div>Attempts: {totalAttempts}</div>
                <div>Avg Time: {avgResponseTime.toFixed(1)}s</div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="leaderboard">
          <h4>Top Scores</h4>
          {leaderboard.map((entry, index) => (
            <div key={entry.id} className="leaderboard-entry">
              <span>#{index + 1}</span>
              <span>{entry.score}</span>
              <span>{new Date(entry.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .settings-container {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .setting-group {
          margin: 15px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stats-section {
          margin-top: 30px;
          padding: 20px;
          border-radius: 8px;
          background: ${darkMode ? '#2a2a2a' : '#f5f5f5'};
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
        }

        .theme-stats, .leaderboard {
          margin-top: 20px;
        }

        .theme-stat {
          background: ${darkMode ? '#333' : '#fff'};
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .theme-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .theme-name {
          font-weight: bold;
          font-size: 1.1em;
        }

        .theme-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 10px;
          font-size: 0.9em;
          color: #666;
        }

        .leaderboard-entry {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          border-bottom: 1px solid ${darkMode ? '#444' : '#ddd'};
        }

        input[type="range"] {
          width: 200px;
        }

        select, input[type="number"] {
          padding: 5px;
          border-radius: 4px;
          border: 1px solid #ccc;
          background: ${darkMode ? '#333' : '#fff'};
          color: ${darkMode ? '#fff' : '#000'};
        }
      `}</style>
    </div>
  );
} 