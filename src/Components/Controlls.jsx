import { useEffect, useState } from "react";

const generateNextReturn = (mines) => {
  let baseMultiplier = 1.01; // Starting multiplier
  let growthFactor = 1.05 + mines * 0.02; // Higher mines = Higher growth

  return Array.from({ length: 24 }, (_, i) => {
    baseMultiplier *= growthFactor;
    return parseFloat(baseMultiplier.toFixed(2)); // Keep precision
  });
};

const initialConfigure = {
  mines: 1, // Default, user can change
  nextReturn: generateNextReturn(1), // Dynamically generated based on mines
  nextReturnIndex: 0,
  balance: 100.0,
  betPool: [
    0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 2.4, 4.0, 8.0, 
    20.0, 40.0, 100.0, 200.0,
  ],
  poolIndex: 0,
  currentEarning: 0,
  diamondsFound: [], // Store selected diamonds
};


export default function Controlls({ onStart, diamond, selectedCell }) {
  const [config, setConfig] = useState(initialConfigure);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (
      diamond &&
      selectedCell !== undefined &&
      !config.diamondsFound.includes(selectedCell)
    ) {
      setConfig((prev) => {
        const nextIndex = Math.min(
          prev.nextReturnIndex + 1,
          prev.nextReturn.length - 1
        ); // Ensures we don’t exceed the array length
        const nextMultiplier =
          prev.nextReturn[nextIndex] ??
          prev.nextReturn[prev.nextReturn.length - 1]; // Prevents undefined error

        const newEarning =
          prev.currentEarning === 0
            ? prev.betPool[prev.poolIndex] * nextMultiplier
            : prev.currentEarning *
              (nextMultiplier / prev.nextReturn[prev.nextReturnIndex]);

        return {
          ...prev,
          nextReturnIndex: nextIndex,
          currentEarning: newEarning,
          diamondsFound: [...prev.diamondsFound, selectedCell],
        };
      });
    }
  }, [diamond, selectedCell]);

  function handleIncreasePool() {
    setConfig((prev) => ({
      ...prev,
      poolIndex: Math.min(prev.poolIndex + 1, prev.betPool.length - 1),
    }));
  }

  function handleDecreasePool() {
    setConfig((prev) => ({
      ...prev,
      poolIndex: Math.max(prev.poolIndex - 1, 0),
    }));
  }

  function handleMines(event) {
    setConfig((prev) => ({
      ...prev,
      mines: Number(event.target.value),
    }));
  }

  function handleStartGame() {
    setGameStarted((prev) => {
      const newState = !prev;
      setTimeout(() => onStart(newState, config.mines), 0);
      return newState;
    });
  }

  //cashout
  function handleCashout() {
    setConfig((prev) => ({
      ...prev,
      balance: prev.balance + prev.currentEarning, // ✅ Add earnings to balance
      currentEarning: 0, // Reset earnings
      diamondsFound: [], // Reset found diamonds
      nextReturnIndex: 0, // Reset multiplier
    }));
    setGameStarted(false); // ✅ Stop game
  }

  return (
    <aside id="right">
      <div className="control-top">
        <label>Mines</label>
        <select className="mines" onChange={handleMines} disabled={gameStarted}>
          {[1, 2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 20].map((num) => (
            <option key={num}>{num}</option>
          ))}
        </select>
        <p>
          Next Return
          <span>{config.nextReturn[config.nextReturnIndex].toFixed(2)}%</span>
        </p>
      </div>
      <img src="miner2.png" alt="miners" />
      <div className="balance">
        Balance : <p>&#8377; {config.balance.toFixed(2)}</p>
      </div>
      <button
        className={`start ${gameStarted ? "startDisable" : ""}`}
        onClick={handleStartGame}
        disabled={gameStarted}
      >
        {`${gameStarted ? "Digging..." : "Start Digging"}`}
      </button>
      <div className="bottom-controls">
        <div className="bottom-controls-left">
          <div>
            <p>Bet Pool</p>
            <span>&#8377; {config.betPool[config.poolIndex].toFixed(2)}</span>
          </div>
          <button onClick={handleDecreasePool} disabled={gameStarted}>
            -
          </button>
          <button onClick={handleIncreasePool} disabled={gameStarted}>
            +
          </button>
        </div>
        <div className="bottom-controls-right">
          <p
            className="cashout"
            onClick={handleCashout}
            disabled={!gameStarted || config.currentEarning === 0}
          >
            CASHOUT
          </p>
          <span>&#8377; {config.currentEarning.toFixed(2)}</span>
        </div>
      </div>
    </aside>
  );
}
