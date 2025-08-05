import { useState, useEffect } from "react";
import { teamsData } from "../data/teamsData";
import playersData from "../data/playersData.json";
import { toast } from "react-toastify";

const normalize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

export const useGameLogic = ({ mode, handleNextTurn }) => {
  const [sequence, setSequence] = useState([]);
  const [input, setInput] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentTeam, setCurrentTeam] = useState("");
  const [previousTeam, setPreviousTeam] = useState("");
  //const [previousPlayer, setPreviousPlayer] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isPlayerGuessing, setIsPlayerGuessing] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const getRandomPlayer = () => {
    const randomIndex = Math.floor(Math.random() * playersData.length);
    return playersData[randomIndex];
  };

  useEffect(() => {
    const player = getRandomPlayer();
    setCurrentPlayer(player);
  }, []);

  const handleInputChange = (e) => {
    const userInput = e.target.value;
    setInput(userInput);

    if (userInput.trim() === "") {
      setSuggestions([]);
      return;
    }

    if (isPlayerGuessing) {
      const filteredSuggestions = playersData.filter((player) => {
        const fullName = `${player.firstName} ${player.lastName}`;
        return normalize(fullName).includes(normalize(userInput));
      });
      setSuggestions(filteredSuggestions.slice(0, 3));
    }
  };

  const normalizeTeamInput = (input) => {
    if (typeof input !== "string") return "";
    return normalize(input.trim());
  };

  const handleSubmit = async (suggestedPlayerName = input) => {
    if (suggestedPlayerName.trim() === "") return false;

    if (currentTeam === "") {
      const normalizedInput = normalizeTeamInput(suggestedPlayerName);

      const validTeam = teamsData.some((data) => {
        const normalizedTeamName = normalizeTeamInput(data.teamName);
        const normalizedSimpleName = normalizeTeamInput(data.simpleName);
        const normalizedLocation = normalizeTeamInput(data.location);

        return (
          normalizedTeamName === normalizedInput ||
          normalizedSimpleName === normalizedInput ||
          normalizedLocation === normalizedInput
        );
      });

      if (validTeam) {
        const isValidTeam = currentPlayer.teams.find((teamString) =>
          normalizeTeamInput(teamString).includes(normalizedInput)
        );

        if (isValidTeam) {
          if (
            normalizeTeamInput(isValidTeam.split(",")[0]) ===
            normalizeTeamInput(previousTeam)
          ) {
            toast.warning("You can't guess the same team consecutively!");
            return false;
          }

          setSequence([
            ...sequence,
            `${currentPlayer.firstName} ${currentPlayer.lastName} / ${
              isValidTeam.split(",")[0]
            }`,
          ]);
          setCurrentTeam(isValidTeam.split(",")[0]);
          setPreviousTeam(isValidTeam.split(",")[0]);
          setIsPlayerGuessing(true);
          setInput("");
          setSuggestions([]);
          if (mode === "multiplayer" && typeof handleNextTurn === "function") {
            handleNextTurn();
          }
          return true;
        } else {
          toast.error("Invalid team for this player!");
          return false;
        }
      } else {
        toast.error("Invalid team! Please enter a valid team.");
        return false;
      }
    } else {
      const playerData = playersData.find(
        (player) =>
          normalize(`${player.firstName} ${player.lastName}`) ===
          normalize(suggestedPlayerName.trim())
      );

      if (playerData) {
        const uniqueTeamNames = new Set(
          playerData.teams.map((teamString) =>
            normalizeTeamInput(teamString.split(",")[0])
          )
        );

        if (uniqueTeamNames.size <= 1) {
          if (mode === "singleplayer") {
            toast.error(
              "This player has only played for one team, and you ended your run."
            );
            return true;
          } else {
            toast.warning(
              "This player has only played for one team, and cannot be used."
            );
            return false;
          }
        }

        const isValidPlayerForTeam = playerData.teams.some((teamString) =>
          normalizeTeamInput(teamString).includes(
            normalizeTeamInput(currentTeam)
          )
        );

        if (isValidPlayerForTeam) {
          const playerFullName = normalize(
            `${playerData.firstName} ${playerData.lastName}`
          );

          // Check for duplicate usage anywhere in the sequence
          const alreadyUsed = sequence.some((entry) =>
            normalize(entry).includes(playerFullName)
          );

          if (alreadyUsed) {
            toast.warning("This player has already been guessed!");
            return false;
          }

          setSequence([
            ...sequence,
            ` ${currentTeam} / ${playerData.firstName} ${playerData.lastName}`,
          ]);
          setCurrentPlayer(playerData);
          //setPreviousPlayer(`${playerData.firstName} ${playerData.lastName}`);
          setCurrentTeam("");
          setIsPlayerGuessing(false);
          setInput("");
          setSuggestions([]);
          if (mode === "multiplayer" && typeof handleNextTurn === "function") {
            handleNextTurn();
          }
          return true;
        } else {
          toast.error("Invalid player for this team!");
          return false;
        }
      } else {
        toast.error("Player not found! Please enter a valid player.");
        return false;
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        const selected = suggestions[highlightedIndex];
        const playerName = `${selected.firstName} ${selected.lastName}`;
        setInput(playerName);
        handleSubmit(playerName);
        setHighlightedIndex(-1);
      } else {
        handleSubmit();
      }
    }
  };

  const resetGameLogic = () => {
    setSequence([]);
    setInput("");
    setCurrentTeam("");
    setPreviousTeam("");
    setSuggestions([]);
    setIsPlayerGuessing(false);
    setHighlightedIndex(-1);

    setCurrentPlayer(getRandomPlayer());
  };

  return {
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
    normalizeTeamInput,
    highlightedIndex,
    setHighlightedIndex,
    resetGameLogic,
  };
};
