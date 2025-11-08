import clientPromise from "@/lib/mongodb";

// Legend to update the playByPlay
const statsLegend = {
  twoPointsMade: "made a two point shot",
  twoPointsAttempted: "missed a two point shot",
  threePointsMade: "made a three point shot",
  threePointsAttempted: "missed a three point shot",
  freeThrowsMade: "made a free throw",
  freeThrowsAttempted: "missed a free throw",
  rebounds: "got a rebound",
  assists: "assisted",
  steals: "stole the ball",
  blocks: "blocked a shot",
  turnovers: "turned the ball over",
  personalFouls: "committed a foul",
  cooked: "got cooked!",
};

export default async function handler(req, res) {
  const method = req?.method;
  const seasonNumber = parseInt(req?.query?.seasonNumber);
  const gameNumber = parseInt(req?.query?.gameNumber);

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
        threePointsMade: 0,
        threePointsAttempted: 0,
        freeThrowsMade: 0,
        freeThrowsAttempted: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        personalFouls: 0,
        cooked: 0,
      };

      // Map through each player to get their shot making percentages
      game.players.forEach((player) => {
        // Add each player's stats to the team's total stats
        Object.keys(teamStats).map((key) => {
          teamStats[key] += player[key];
        });
      });

      // Format the play-by-play with full stat phrases
      const quarters =
        Object.entries(game.playByPlay).length === 1
          ? game.playByPlay.allQuarters
          : Object.values(game.playByPlay).map((value) => value);

      let allPlays;

      if (quarters.length === 4) {
        allPlays = quarters.map((quarter) => {
          const playsInQuarter = quarter.map((play) => {
            return `${play.playerName} ${statsLegend[play.stat]}`;
          });

          return playsInQuarter;
        });
      } else {
        allPlays = quarters.map((play) => {
          return `${play.playerName} ${statsLegend[play.stat]}`;
        });
      }

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
        players: game.players.sort(
          (player1, player2) => player1.number - player2.number
        ),
        playByPlay: allPlays,
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
