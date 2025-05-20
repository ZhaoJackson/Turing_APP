import { GameProvider } from '../contexts/GameContext';
import { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import '../styles/globals.css';

function DarkModeHandler() {
  const { darkMode } = useGame();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return null;
}

function MyApp({ Component, pageProps }) {
  return (
    <GameProvider>
      <DarkModeHandler />
      <Component {...pageProps} />
    </GameProvider>
  );
}

export default MyApp; 