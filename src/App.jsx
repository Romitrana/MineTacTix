import "./App.css";
import { useState } from "react";
import Land from "./Components/Land.jsx";
import Header from "./Components/Header.jsx";
import Controlls from "./Components/Controlls.jsx";

function App() {
  const [isStarted, setIsStarted] = useState({ start: false, mines: 1 });
  const [isDiamond, setIsDiamond] = useState(null);
  const [resetGame, setResetGame] = useState(false); // NEW: Track reset state

  function handleGameStatus(gameStatus, configMines) {
    setIsStarted({ start: gameStatus, mines: configMines });
    setResetGame(false); // Reset game flag when manually starting
  }

  function handleMinesDiamonds(isDia, position) {
    setIsDiamond({ status: isDia, cell: position });

    if (!isDia) {
      // If bomb is found, reset the game
      setTimeout(() => {
        setResetGame(true); // Trigger reset in Land
        setIsStarted({ start: false, mines: isStarted.mines }); // Stop game
      }, 500); // Delay for UI effect
    }
  }

  return (
    <div className="App">
      <aside id="left">
        <Header />
        <Land gameStarted={isStarted} ondig={handleMinesDiamonds} reset={resetGame} />
      </aside>
      <Controlls
        onStart={handleGameStatus}
        diamond={isDiamond?.status}
        selectedCell={isDiamond?.cell}
      />
    </div>
  );
}

export default App;
