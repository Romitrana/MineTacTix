import "./App.css";
import { useState } from "react";
import Land from "./Components/Land.jsx";
import Header from "./Components/Header.jsx";
import Controlls from "./Components/Controlls.jsx";
// import { useState } from "react";

function App() {
  const [isStarted, setIsStarted] = useState(false);
  function handleGameStatus(gameStatus) {
    setIsStarted(gameStatus);
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
