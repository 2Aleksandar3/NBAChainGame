import { useGameLogic } from "../hooks/useGameLogic";
import { useTimer } from "../hooks/useTimer";
import Timer from "../components/Timer";
import PlayerInfo from "../components/PlayerInfo";
import Input from "../components/Input";
import Suggestion from "../components/Suggestion";
import Sequence from "../components/Sequence";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const SinglePlayer = () => {
  const inputRef = useRef(null);

  const {
    sequence,
    input,
    setInput,
    currentPlayer,
    currentTeam,
    suggestions,
    isPlayerGuessing,
    handleInputChange,
    handleSubmit,
    handleKeyDown,
    setHighlightedIndex,
    highlightedIndex,
    resetGameLogic,
  } = useGameLogic({ mode: "singleplayer" });

  let timeStart = 45;

  const { timeLeft, gameOver, setGameOver, setTimeLeft } = useTimer(
    currentPlayer,
    sequence,
    timeStart
  );

  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem("highScore")) || 0
  );

  useEffect(() => {
    if (gameOver) {
      const currentScore = sequence.length;
      const storedHighScore = parseInt(localStorage.getItem("highScore")) || 0;

      if (currentScore > storedHighScore) {
        localStorage.setItem("highScore", currentScore);
        setHighScore(currentScore);
      }
    }
  }, [gameOver, sequence]);

  const handlePlayAgain = () => {
    setGameOver(false);
    setTimeLeft(timeStart);
    resetGameLogic();
  };

  const navigate = useNavigate();

  const handleNavigateToMultiplayer = () => {
    navigate("/multiplayer");
  };

  return (
    <div>
      <h1 className="title">NBA Chain Game</h1>

      <h4>
        Start with a player, then alternate between typing a team and a player.
      </h4>
      <button onClick={handleNavigateToMultiplayer}>Multiplayer</button>
      <Timer
        gameOver={gameOver}
        timeLeft={timeLeft}
        sequence={sequence}
        handlePlayAgain={handlePlayAgain}
        highScore={highScore}
        mode="singleplayer"
      />
      <PlayerInfo currentPlayer={currentPlayer} currentTeam={currentTeam} />
      <Input
        input={input}
        handleInputChange={handleInputChange}
        handleKeyDown={handleKeyDown}
        handleSubmit={handleSubmit}
        gameOver={gameOver}
        inputRef={inputRef}
      />
      <Suggestion
        setInput={setInput}
        suggestions={suggestions}
        isPlayerGuessing={isPlayerGuessing}
        handleSubmit={handleSubmit}
        inputRef={inputRef}
        highlightedIndex={highlightedIndex}
        setHighlightedIndex={setHighlightedIndex}
      />
      <Sequence sequence={sequence} />
    </div>
  );
};

export default SinglePlayer;
