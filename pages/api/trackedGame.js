import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  // Authorize server access using NextAuth
  const session = await getServerSession(req, res, authOptions);

  // If user tries to access a tracked game without having a session
  if (!session) {
    return res.status(401).send("Must login to access this information!");
  }

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");

  const method = req.method;

  // Function to get the tracked game data from MongoDB
  async function getTrackedGameData() {
    try {
      const trackedGame = await gamesCol.findOne({ currentlyTracking: true });

      if (trackedGame) {
        return trackedGame;
      } else {
        return null;
      }
    } catch (error) {
      console.error(
        `Error retrieving the tracked game data from MongoDB: ${error}`
      );
      throw new Error(error);
    }
  }

  if (method === "GET") {
    try {
      const trackedGame = await getTrackedGameData();

      res.status(200).json(trackedGame);
    } catch (error) {
      console.error(`${method} tracked game request failed: ${error}`);
      res.status(500).send("Error retrieving tracked game data");
    }
  } else if (method === "POST") {
    try {
      const trackedGame = req?.body;

      // Save the tracked game in MongoDB
      const postTrackedGameResult = await gamesCol.updateOne(
        {
          currentlyTracking: true,
        },
        {
          $set: {
            seasonNumber: trackedGame.seasonNumber,
            gameNumber: trackedGame.gameNumber,
            date: trackedGame.date,
            location: trackedGame.location,
            opponent: trackedGame.opponent,
            valleyViceScore: trackedGame.valleyViceScore,
            opponentScore: trackedGame.opponentScore,
            result: trackedGame.result,
            teamStats: trackedGame.teamStats,
            players: trackedGame.players,
            playByPlay: trackedGame.playByPlay,
            currentlyTracking: true,
          },
        },
        { upsert: true }
      );
      console.log(postTrackedGameResult);

      res.status(200).json(trackedGame);
    } catch (error) {
      console.error(`${method} tracked game request failed: ${error}`);
      res.status(500).send("Error retrieving tracked game data");
    }
  } else if (method === "DELETE") {
    try {
      // Delete the saved tracked game from MongoDB
      const deleteTrackedGameResult = await gamesCol.deleteOne({
        currentlyTracking: true,
      });
      console.log(deleteTrackedGameResult);

      res.status(200).send("Tracked game deleted successfully");
    } catch (error) {
      console.error(`${method} tracked game request failed: ${error}`);
      res.status(500).send("Error deleting tracked game");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
