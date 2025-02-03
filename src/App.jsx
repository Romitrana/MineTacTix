import "./App.css";
import { useState } from "react";
import Land from "./Components/Land.jsx";
import Header from "./Components/Header.jsx";
import Controlls from "./Components/Controlls.jsx";
// import { useState } from "react";

function App() {
  const [isStarted, setIsStarted] = useState({start:false,mines:1});
  function handleGameStatus(gameStatus,configMines) {
    setIsStarted(prev=>{ 
      const prevObj = {...prev,start:gameStatus,mines:configMines};
      return prevObj;
    });
  }

  return (
    <div className="App">
      <aside id="left">
        <Header />
        <Land gameStarted={isStarted} />
      </aside>
      <Controlls onStart={handleGameStatus} />
    </div>
  );
}

export default App;
