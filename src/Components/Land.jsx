import { useRef, useState, useEffect } from "react";

const initialLand = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
];

export default function Land({ gameStarted, ondig, reset }) {
  const { start, mines } = gameStarted;
  const audioRef = useRef(null);
  const [minePositions, setMinePositions] = useState([]);
  const [revealedCells, setRevealedCells] = useState(new Set());
  const [land, setLand] = useState(initialLand);

  // Reset the game if `reset` is triggered
  useEffect(() => {
    if (reset) {
      console.log("Game resetting...");
      setMinePositions([]);
      setRevealedCells(new Set());
      setLand(initialLand);
    }
  }, [reset]);

  // Generate new mine positions when game starts
  useEffect(() => {
    if (start) {
      const positions = new Set();
      while (positions.size < mines) {
        positions.add(Math.floor(Math.random() * 25)); // 5x5 grid
      }
      setMinePositions(Array.from(positions));
      setRevealedCells(new Set()); // Reset revealed cells
      setLand(initialLand); // Reset land state
    }
  }, [start, mines]);

  const handleClickBox = (rowIndex, colIndex) => {
    const position = rowIndex * 5 + colIndex;
    if (revealedCells.has(position)) return;

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    const isMine = minePositions.includes(position);
    setRevealedCells((prev) => new Set(prev).add(position));

    ondig(!isMine, position);

    setLand((prevLand) =>
      prevLand.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx === rowIndex && cIdx === colIndex) {
            return isMine ? "mine" : "diamond";
          }
          return cell;
        })
      )
    );
  };

  return (
    <>
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
                  : "/logos/soil3.jpg";

                return (
                  <li key={colIndex} className={start ? "" : "disabled"}>
                    <img
                      src={imgSrc}
                      alt={cell === "mine" ? "Mine" : "Diamond"}
                      className="flipableImage"
                      onClick={
                        start ? () => handleClickBox(rowIndex, colIndex) : undefined
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
