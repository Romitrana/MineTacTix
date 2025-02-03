import { useRef } from "react";

const land = [
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
  [null, null, null, null, null],
];

export default function Land({ gameStarted }) {
  const audioRef = useRef(null);

  const handleClick = () => {
    console.log("breaked");
    if (audioRef.current) {
      // Reset audio to the start and play it again
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play(); // Play audio
    }
  };

  return (
    <>
      {/* Cracking Sound */}
      <audio ref={audioRef} src="/LandCrackAudio.mp3" preload="auto" />

      <ol className="land">
        {land.map((row, rowIndex) => (
          <li key={rowIndex} className="row">
            <ol>
              {row.map((col, colIndex) => (
                <li key={colIndex} className={gameStarted ? "" : "disabled"}>
                  <img
                    src="/logos/soil3.jpg"
                    alt="diamond"
                    className="flipableImage"
                    onClick={gameStarted ? handleClick : undefined}
                  />
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </>
  );
}
