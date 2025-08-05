import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useTimer = (
  currentPlayer,
  sequence,
  timeStart,
  currentTurn,
  activePlayersCount
) => {
  const [timeLeft, setTimeLeft] = useState(timeStart);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setTimeLeft(timeStart);
    setGameOver(false);
  }, [currentTurn, timeStart]);

  useEffect(() => {
    if (activePlayersCount !== 1) {
      setGameOver(false);
    }
  }, [activePlayersCount]);

  useEffect(() => {
    let interval;
    let timeout;

    if (currentPlayer && !gameOver && sequence.length > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            clearInterval(interval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      timeout = setTimeout(() => {
        setGameOver(true);
        toast.success(`Time's up! You made ${sequence.length} links!`);
      }, timeLeft * 1000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentPlayer, gameOver, sequence.length, timeLeft]);

  return { timeLeft, gameOver, setGameOver, setTimeLeft };
};
