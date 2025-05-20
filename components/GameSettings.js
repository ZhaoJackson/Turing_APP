import { useGame } from '../contexts/GameContext';
import { useState, useEffect } from 'react';

export default function GameSettings({ onClose }) {
  const {
    darkMode,
    setDarkMode,
    fontSize,
    setFontSize,
    timeLimit,
    setTimeLimit
  } = useGame();

  // Temporary state for settings changes
  const [tempSettings, setTempSettings] = useState({
    darkMode,
    fontSize,
    timeLimit
  });

  // Update temp settings when modal opens
  useEffect(() => {
    setTempSettings({
      darkMode,
      fontSize,
      timeLimit
    });
  }, [darkMode, fontSize, timeLimit]);

  const handleConfirm = () => {
    setDarkMode(tempSettings.darkMode);
    setFontSize(tempSettings.fontSize);
    setTimeLimit(tempSettings.timeLimit);
    onClose();
  };

  const handleReset = () => {
    setTempSettings({
      darkMode,
      fontSize,
      timeLimit
    });
  };

  return (
    <div className="settings-modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: tempSettings.darkMode ? '#333' : '#fff',
        padding: '20px',
        borderRadius: '8px',
        width: '300px',
        color: tempSettings.darkMode ? '#fff' : '#000'
      }}>
        <h2>Settings</h2>
        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Dark Mode
            </label>
            <button
              onClick={() => setTempSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: tempSettings.darkMode ? '#666' : '#0070f3',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {tempSettings.darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Font Size
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={tempSettings.fontSize}
              onChange={(e) => setTempSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: `${tempSettings.fontSize}px` }}>Aa</span>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Time Limit (seconds)
            </label>
            <input
              type="range"
              min="30"
              max="90"
              step="30"
              value={tempSettings.timeLimit}
              onChange={(e) => setTempSettings(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
              style={{ width: '100%' }}
            />
            <span>{tempSettings.timeLimit}s</span>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '20px',
            gap: '10px'
          }}>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Reset
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                backgroundColor: '#0070f3',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                flex: 1
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 