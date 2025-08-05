import { useState, useEffect } from "react";

function TestTurns() {
  const [numUsers, setNumUsers] = useState(2); // Default to 2 users
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // Default time for each user
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const initialUsers = [];
    for (let i = 0; i < numUsers; i++) {
      initialUsers.push({ id: i + 1, timeLeft: 5, active: true }); // Each user starts with 5 seconds
    }
    setUsers(initialUsers);
  }, [numUsers]);

  useEffect(() => {
    if (gameOver) return; // If the game is over, do nothing

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup interval
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Eliminate the current user if their time runs out
      const updatedUsers = [...users];
      updatedUsers[currentUserIndex].active = false;

      setUsers(updatedUsers);

      // Find the next user who is still active
      let nextUserIndex = (currentUserIndex + 1) % numUsers;
      while (!updatedUsers[nextUserIndex].active) {
        nextUserIndex = (nextUserIndex + 1) % numUsers;
      }

      setCurrentUserIndex(nextUserIndex);
      setTimeLeft(5); // Reset time for the new current user
    }
  }, [timeLeft, currentUserIndex, users]);

  const handleUserCountChange = (event) => {
    const count = parseInt(event.target.value);
    if (count >= 2 && count <= 11) {
      setNumUsers(count);
    }
  };

  // Handle the manual turn change
  const nextTurn = () => {
    const updatedUsers = [...users];
    // Move to the next user, skipping eliminated ones
    let nextUserIndex = (currentUserIndex + 1) % numUsers;
    while (!updatedUsers[nextUserIndex].active) {
      nextUserIndex = (nextUserIndex + 1) % numUsers;
    }

    setCurrentUserIndex(nextUserIndex);
    setTimeLeft(5); // Reset time for the new current user
  };

  return (
    <div>
      <h1>Turn Based User Game</h1>
      <label>
        Enter number of users (2 to 11):
        <input
          type="number"
          value={numUsers}
          onChange={handleUserCountChange}
          min="2"
          max="11"
        />
      </label>
      <div>
        <h2>Current User: User {users[currentUserIndex]?.id}</h2>
        <p>Time Left: {timeLeft}s</p>
      </div>
      <div>
        <h3>User Statuses:</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id} style={{ color: user.active ? "green" : "red" }}>
              User {user.id}: {user.active ? "Active" : "Eliminated"}
            </li>
          ))}
        </ul>
      </div>

      {/* Manual Turn Change Button */}
      <button onClick={nextTurn} disabled={gameOver}>
        Next Turn
      </button>

      {gameOver && <h2>Game Over! All users are eliminated.</h2>}
    </div>
  );
}

export default TestTurns;
