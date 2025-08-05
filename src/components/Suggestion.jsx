/* eslint-disable react/prop-types */

const Suggestion = ({
  setInput,
  isPlayerGuessing,
  suggestions,
  handleSubmit,
  inputRef,
  highlightedIndex,
  setHighlightedIndex,
}) => {
  const handleSuggestionClick = (playerName) => {
    console.log("Clicked suggestion:", playerName);
    setInput(playerName);
    handleSubmit(playerName);
    if (inputRef?.current && !inputRef.current.disabled) {
      inputRef.current.focus();
    }
    setHighlightedIndex(-1);
  };

  return (
    <div>
      {isPlayerGuessing && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((player, index) => {
            const playerName = `${player.firstName} ${player.lastName}`;
            return (
              <div
                key={index}
                className={`suggestion-item ${
                  index === highlightedIndex ? "highlighted" : ""
                }`}
                onClick={() => handleSuggestionClick(playerName)}
              >
                {playerName}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Suggestion;
