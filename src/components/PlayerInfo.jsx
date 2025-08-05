/* eslint-disable react/prop-types */
const PlayerInfo = ({ currentPlayer, currentTeam }) => {
  return (
    <div>
      {currentPlayer ? (
        <h3>
          Current: {currentPlayer.firstName} {currentPlayer.lastName} /{" "}
          {currentTeam || "Team"}
          <br />
          <p>
            <img src={currentPlayer.headshotUrl} alt="No player image" />
          </p>
        </h3>
      ) : (
        <h3>Loading player...</h3>
      )}
    </div>
  );
};

export default PlayerInfo;
