/* eslint-disable react/prop-types */
const Timer = ({
  gameOver,
  timeLeft,
  sequence,
  handlePlayAgain,
  highScore,
  mode,
}) => {
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
        </div>
      )}
    </div>
  );
};

export default Timer;
