/* eslint-disable react/prop-types */
import { useState } from "react";
import ShareModal from "./Modal";
const Timer = ({
  gameOver,
  timeLeft,
  sequence,
  handlePlayAgain,
  highScore,
  mode,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const shareUrl = window.location.href;

  return (
    <div>
      {!gameOver && (
        <h3>
          Time Left:{" "}
          <span className={`ozone-timer ${timeLeft < 15 ? "low" : ""}`}>
            {timeLeft}
          </span>{" "}
          seconds
        </h3>
      )}{" "}
      {gameOver && mode === "multiplayer" && (
        <div>
          <h2>Game Over! You made {sequence.length} links.</h2>

          <button onClick={handlePlayAgain}>Play Again</button>
        </div>
      )}
      {gameOver && mode === "singleplayer" && (
        <div>
          <h2>Game Over! You made {sequence.length} links.</h2>
          <h2>Your highscore is {highScore} </h2>
          <button onClick={handlePlayAgain}>Play Again</button>
          <button onClick={handleShowModal}>Share Your Score</button>
        </div>
      )}
      <ShareModal
        show={showModal}
        handleClose={handleCloseModal}
        score={sequence.length}
        shareUrl={shareUrl}
      />
    </div>
  );
};

export default Timer;
