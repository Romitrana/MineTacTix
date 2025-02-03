import { useState} from "react";

const initialConfigure = {
  mines: 1,
  nextReturn: [
    1.01, 1.05, 1.1, 1.15, 1.21, 1.27, 1.34, 1.42, 1.51, 1.61, 1.73, 1.86, 2.02,
    2.2, 2.42, 2.69, 3.3, 3.46, 4.04, 4.85,
  ],
  nextReturnIndex: 0,
  balance: 100.0,
  betPool: [
    0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 2.4, 4.0, 8.0, 20.0, 40.0, 100.0,
    200.0,
  ],
  poolIndex: 0,
  boomsIndexs:[]
};
export default function Controlls({ onStart }) {
  const [config, setConfig] = useState(initialConfigure);
  const [gameStarted, setGameStarted] = useState(false);

  function handleIncreasePool() {
    let oldpoolIndex = config.poolIndex;
    if (oldpoolIndex + 1 > 14) {
      return;
    }
    setConfig((prev) => {
      const newConfig = { ...prev, poolIndex: prev.poolIndex + 1 };
      return newConfig;
    });
  }

  function handleDecreasePool() {
    let oldpoolIndex = config.poolIndex;
    if (oldpoolIndex - 1 < 0) {
      return;
    }
    setConfig((prev) => {
      const newConfig = { ...prev, poolIndex: prev.poolIndex - 1 };
      return newConfig;
    });
  }
  function handleMines(event) {
    setConfig((prev) => {
      const newConfig = { ...prev, mines: event.target.value };
      return newConfig;
    });
  }

  //start game
  function handleStartGame() {
    setGameStarted((prev) => {
      const newState = !prev;
      setTimeout(() => onStart(newState), 0);  // ✅ Fix: Defers state update
      return newState;
    });
  }
  

  return (
    <aside id="right">
      <div className="control-top">
        <label>Mines</label>
        <select className="mines" onChange={handleMines} disabled={gameStarted}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>6</option>
          <option>8</option>
          <option>10</option>
          <option>12</option>
          <option>14</option>
          <option>16</option>
          <option>18</option>
          <option>20</option>
        </select>
        <p>
          Next Return
          <span>{config.nextReturn[config.nextReturnIndex].toFixed(2)}%</span>
        </p>
      </div>
      <img src="miner2.png" alt="miners" />
      <div className="balance">
        Balance : <p>&#8377; {config.balance}</p>
      </div>
      <button
        className={`start ${gameStarted ? "startDisable" : null}`}
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
          <p>CASHOUT</p>
          <span>&#8377; {210}</span>
        </div>
      </div>
    </aside>
  );
}
