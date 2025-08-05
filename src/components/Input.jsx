/* eslint-disable react/prop-types */

const Input = ({
  input,
  handleInputChange,
  handleKeyDown,
  handleSubmit,
  gameOver,
  inputRef,
}) => {
  return (
    <div className="input-container">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a team or player"
        disabled={gameOver}
      />
      <button onClick={() => handleSubmit()} disabled={gameOver}>
        Submit
      </button>
    </div>
  );
};

export default Input;
