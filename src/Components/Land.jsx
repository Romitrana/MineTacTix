import { useRef, useState, useEffect } from "react";

const initialLand = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
];

export default function Land({ gameStarted, ondig }) {
  const { start, mines } = gameStarted;
  const audioRef = useRef(null);
  const [minePositions, setMinePositions] = useState([]);
  const [revealedCells, setRevealedCells] = useState(new Set()); // Track revealed cells
  const [land, setLand] = useState(initialLand);

  // Generate random mine positions when game starts
  useEffect(() => {
    if (start) {
      const positions = new Set();
      while (positions.size < mines) {
        positions.add(Math.floor(Math.random() * 25)); // 5x5 grid
      }
      setMinePositions(Array.from(positions));
      setRevealedCells(new Set()); // Reset revealed cells when game restarts
      setLand(initialLand); // Reset land state
    }
  }, [start, mines]);

  const handleClickBox = (rowIndex, colIndex) => {
    const position = rowIndex * 5 + colIndex; // can from [0-24]
    if (revealedCells.has(position)) return; //no double clicked

    if (audioRef.current) {
      // Reset audio to the start and play it again
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play(); // Play audio
    }

    // Determine if it's a mine or a safe spot
    const isMine = minePositions.includes(position);

    // Update revealed cells
    setRevealedCells((prev) => new Set(prev).add(position));

    //updating nextReturn and cashout

    if (!isMine) {
      ondig(true, position); // Send both diamond status and position
    } else {
      ondig(false, position);
    }
    

    // Update land state
    setLand((prevLand) => {
      const newLand = prevLand.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === rowIndex && cIdx === colIndex) {
            return isMine ? "mine" : "diamond"; // Store result
          }
          return cell;
        })
      );
      return newLand;
    });
  };

  return (
    <>
      {/* Broken Sound */}
      <audio ref={audioRef} src="/LandCrackAudio.mp3" preload="auto" />

      <ol className="land">
        {land.map((row, rowIndex) => (
          <li key={rowIndex} className="row">
            <ol>
              {row.map((cell, colIndex) => {
                const position = rowIndex * 5 + colIndex;
                const isRevealed = revealedCells.has(position);
                const imgSrc = isRevealed
                  ? cell === "mine"
                    ? "/logos/bomb.png"
                    : "/logos/diamond2.png"
                  : "/logos/soil3.jpg"; // Default land image

                return (
                  <li key={colIndex} className={start ? "" : "disabled"}>
                    <img
                      src={imgSrc}
                      alt={cell === "mine" ? "Mine" : "Diamond"}
                      className="flipableImage"
                      onClick={
                        start
                          ? () => handleClickBox(rowIndex, colIndex)
                          : undefined
                      }
                    />
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </>
  );
}

//start from state lifting from here to app.js and then to controll.jsx
