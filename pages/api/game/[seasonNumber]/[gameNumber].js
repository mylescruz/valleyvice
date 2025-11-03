import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  // Authorize server access using NextAuth
  const session = await getServerSession(req, res, authOptions);

  const method = req?.method;
  const seasonNumber = parseInt(req?.query?.seasonNumber);
  const gameNumber = parseInt(req?.query?.gameNumber);

  // If user tries to change the season data without having a session
  if (method !== "GET" && !session) {
    return res.status(401).send("Must login to access this information!");
  }

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");

  // Get game data from MongoDB
  async function getGame(seasonNumber, gameNumber) {
    try {
      const game = await gamesCol.findOne({
        seasonNumber: seasonNumber,
        gameNumber: gameNumber,
      });

      // Track the team's total stats
      let teamStats = {
        points: 0,
        twoPointsMade: 0,
        twoPointsAttempted: 0,
        twoPointPercentage: 0,
        threePointsMade: 0,
        threePointsAttempted: 0,
        threePointPercentage: 0,
        fieldGoalsMade: 0,
        fieldGoalsAttempted: 0,
        fieldGoalPercentage: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        freeThrowPercentage: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        personalFouls: 0,
        cooked: 0,
      };

      // Map through each player to get their shot making percentages
      const players = game.players
        .map((player) => {
          // Add each player's stats to the team's total stats
          teamStats.points += player.points;
          teamStats.twoPointsMade += player.twoPointsMade;
          teamStats.twoPointsAttempted += player.twoPointsAttempted;
          teamStats.threePointsMade += player.threePointsMade;
          teamStats.threePointsAttempted += player.threePointsAttempted;
          teamStats.fieldGoalsMade += player.fieldGoalsMade;
          teamStats.fieldGoalsAttempted += player.fieldGoalsAttempted;
          teamStats.freeThrowsMade += player.freeThrowsMade;
          teamStats.freeThrowsAttempted += player.freeThrowsAttempted;
          teamStats.freeThrowPercentage += player.freeThrowPercentage;
          teamStats.rebounds += player.rebounds;
          teamStats.assists += player.assists;
          teamStats.steals += player.steals;
          teamStats.blocks += player.blocks;
          teamStats.turnovers += player.turnovers;
          teamStats.personalFouls += player.personalFouls;
          teamStats.cooked += player.cooked;

          return {
            ...player,
            twoPointPercentage:
              player.twoPointsAttempted !== 0
                ? (
                    (player.twoPointsMade / player.twoPointsAttempted) *
                    100
                  ).toFixed(0)
                : "0",
            threePointPercentage:
              player.threePointsAttempted !== 0
                ? (
                    (player.threePointsMade / player.threePointsAttempted) *
                    100
                  ).toFixed(0)
                : "0",
            freeThrowPercentage:
              player.freeThrowsAttempted !== 0
                ? (
                    (player.freeThrowsMade / player.freeThrowsAttempted) *
                    100
                  ).toFixed(0)
                : "0",
          };
        })
        .sort((player1, player2) => player1.number - player2.number);

      return {
        ...game,
        teamStats: {
          ...teamStats,
          twoPointPercentage:
            teamStats.twoPointsAttempted !== 0
              ? (
                  (teamStats.twoPointsMade / teamStats.twoPointsAttempted) *
                  100
                ).toFixed(0)
              : "0",
          threePointPercentage:
            teamStats.threePointsAttempted !== 0
              ? (
                  (teamStats.threePointsMade / teamStats.threePointsAttempted) *
                  100
                ).toFixed(0)
              : "0",
          freeThrowPercentage:
            teamStats.freeThrowsAttempted !== 0
              ? (
                  (teamStats.freeThrowsMade / teamStats.freeThrowsAttempted) *
                  100
                ).toFixed(0)
              : "0",
        },
        players: players,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  if (method === "GET") {
    try {
      // Get game data based on the season and game number
      const game = await getGame(seasonNumber, gameNumber);

      // Send retrieved game back to the client
      res.status(200).json(game);
    } catch (error) {
      console.error(`${method} game request failed: ${error}`);
      res.status(500).send("Error getting game data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
