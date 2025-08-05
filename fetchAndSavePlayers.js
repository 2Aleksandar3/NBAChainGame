import { writeFileSync } from "fs";
import axios from "axios"; // Use default axios import

const fetchAllPlayers = async () => {
  const options = {
    method: "POST",
    url: "https://basketball-head.p.rapidapi.com/players",
    headers: {
      "Content-Type": "application/json",
      "x-rapidapi-key": "a61b732059msha00b0577d26d3e1p1a070ajsn6b7ef95f0662", // Replace with your API key
      "x-rapidapi-host": "basketball-head.p.rapidapi.com",
    },
  };

  const players = [];
  let lastEvaluatedKey = null; // Variable to keep track of pagination

  try {
    while (true) {
      // Add lastEvaluatedKey to the request data if it exists
      const requestData = lastEvaluatedKey
        ? { pageSize: 100, lastEvaluatedKey } // Include pagination key
        : { pageSize: 100 };

      const response = await axios.request({
        ...options,
        data: requestData,
      });

      // Check if the body is an array and contains players
      if (Array.isArray(response.data.body) && response.data.body.length > 0) {
        players.push(...response.data.body);
        console.log(`Fetched players, total players: ${players.length}`);
      }

      // Handle pagination: check if there is a next page using lastEvaluatedKey
      lastEvaluatedKey = response.data.lastEvaluatedKey || null;

      if (!lastEvaluatedKey) {
        // If no lastEvaluatedKey, it means we reached the last page
        console.log("No more players found, stopping.");
        break;
      }
    }

    return players;
  } catch (error) {
    console.error("Error fetching player data:", error.message);
    return [];
  }
};

const savePlayersToFile = async () => {
  const players = await fetchAllPlayers();

  if (players.length > 0) {
    try {
      writeFileSync(
        "./src/data/playersData.json",
        JSON.stringify(players, null, 2),
        "utf-8"
      );
      console.log("Players data saved successfully to playersData.json");
    } catch (error) {
      console.error("Error saving players data to file:", error.message);
    }
  } else {
    console.log("No players data fetched.");
  }
};

savePlayersToFile();
