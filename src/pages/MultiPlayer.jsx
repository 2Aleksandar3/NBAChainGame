import { useState, useEffect } from "react";
import { useGameLogic } from "../hooks/useGameLogic";
import { useTimer } from "../hooks/useTimer";
import Timer from "../components/Timer";
import PlayerInfo from "../components/PlayerInfo";
import Input from "../components/Input";
import Suggestion from "../components/Suggestion";
import Sequence from "../components/Sequence";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { toast } from "react-toastify";

const Multiplayer = () => {
  const [numPlayers, setNumPlayers] = useState("");
  const [players, setPlayers] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const inputRef = useRef(null);

  const handleNextTurn = () => {
    if (gameOver) return;
    let nextTurn = (currentTurn + 1) % players.length;

    while (!players[nextTurn].active) {
      nextTurn = (nextTurn + 1) % players.length;
    }

    setCurrentTurn(nextTurn);
    setTimeLeft(10);
    setTimerGameOver(false);
  };

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
  } = useGameLogic({ mode: "multiplayer", handleNextTurn });

  const handleNumPlayersChange = (e) => {
    setNumPlayers(e.target.value);
  };

  const handleStartGame = () => {
    const num = parseInt(numPlayers, 10);
    if (num >= 2 && num <= 11) {
      const playersArray = Array.from({ length: num }, (_, index) => ({
        id: index + 1,
        name: `User ${index + 1}`,
        active: true,
      }));
      setPlayers(playersArray);
      setGameStarted(true);
    } else {
      toast.warning("Please enter a valid number of players between 2 and 11.");
    }
  };

  const activePlayersCount = players.filter((player) => player.active).length;

  const {
    timeLeft,
    gameOver: timerGameOver,
    setGameOver: setTimerGameOver,
    setTimeLeft,
  } = useTimer(currentPlayer, sequence, 10, currentTurn, activePlayersCount);

  useEffect(() => {
    if (timerGameOver) {
      setGameOver(true);
    }
  }, [timerGameOver]);

  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      const updatedPlayers = [...players];
      updatedPlayers[currentTurn].active = false;

      setPlayers(updatedPlayers);

      const activePlayers = updatedPlayers.filter((player) => player.active);
      if (activePlayers.length <= 1) {
        setGameOver(true);
        const winner = activePlayers[0].name;
        toast.success(`${winner} wins!`);
        return;
      }

      let nextPlayer = (currentTurn + 1) % players.length;
      while (!updatedPlayers[nextPlayer].active) {
        nextPlayer = (nextPlayer + 1) % players.length;
      }

      setCurrentTurn(nextPlayer);
      setTimeLeft(10);
      setTimerGameOver(false);
    }
  }, [timeLeft, currentTurn, players, gameOver, setTimeLeft, setTimerGameOver]);

  const navigate = useNavigate();

  const handleNavigateToSingleplayer = () => {
    navigate("/");
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setTimeLeft(10);
    setTimerGameOver(false);
    setCurrentTurn(0);
    setPlayers([]);
    setNumPlayers("");
    setGameStarted(false);
    resetGameLogic();
  };

  return (
    <div>
      <h1>NBA Chain Game (Multiplayer)</h1>

      {!gameStarted ? (
        <>
          <h3>How many users are there? (Enter a number from 2 to 11)</h3>
          <input
            type="number"
            value={numPlayers}
            onChange={handleNumPlayersChange}
            min="2"
            max="11"
            placeholder="2-11"
            className="inputNumber"
          />
          <button onClick={handleStartGame}>Start Game</button>
        </>
      ) : (
        <>
          <h4>
            Start with a player, then alternate between typing a team and a
            player.
          </h4>

          <button onClick={handleNavigateToSingleplayer}>Singleplayer</button>

          <h2>{players[currentTurn].name}s Turn</h2>

          <Timer
            gameOver={gameOver}
            timeLeft={timeLeft}
            sequence={sequence}
            handlePlayAgain={handlePlayAgain}
            mode="multiplayer"
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
        </>
      )}
    </div>
  );
};

export default Multiplayer;
