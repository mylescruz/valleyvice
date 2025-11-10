import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const method = req.method;
  const playerId = req.query?.playerId;

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const playersCol = db.collection("players");

  // Function to get the player data from MongoDB
  async function getPlayerData() {
    try {
      const player = await playersCol.findOne({ playerId: playerId });

      // Define player's total stats
      let totalStats = {
        gamesPlayed: 0,
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

      const seasons = player.seasons.map((season) => {
        Object.keys(totalStats).map((key) => {
          totalStats[key] += season[key];
        });

        return {
          ...season,
          averageStats: {
            seasonNumber: season.seasonNumber,
            gamesPlayed: season.gamesPlayed,
            points: season.points / season.gamesPlayed,
            twoPointsMade: season.twoPointsMade / season.gamesPlayed,
            twoPointsAttempted: season.twoPointsAttempted / season.gamesPlayed,
            threePointsMade: season.threePointsMade / season.gamesPlayed,
            threePointsAttempted:
              season.threePointsAttempted / season.gamesPlayed,
            freeThrowsMade: season.freeThrowsMade / season.gamesPlayed,
            freeThrowsAttempted:
              season.freeThrowsAttempted / season.gamesPlayed,
            rebounds: season.rebounds / season.gamesPlayed,
            assists: season.assists / season.gamesPlayed,
            steals: season.steals / season.gamesPlayed,
            blocks: season.blocks / season.gamesPlayed,
            turnovers: season.turnovers / season.gamesPlayed,
            personalFouls: season.personalFouls / season.gamesPlayed,
            cooked: season.cooked / season.gamesPlayed,
          },
        };
      });

      const averageStats = {
        gamesPlayed: totalStats.gamesPlayed,
        points: totalStats.points / totalStats.gamesPlayed,
        twoPointsMade: totalStats.twoPointsMade / totalStats.gamesPlayed,
        twoPointsAttempted:
          totalStats.twoPointsAttempted / totalStats.gamesPlayed,
        threePointsMade: totalStats.threePointsMade / totalStats.gamesPlayed,
        threePointsAttempted:
          totalStats.threePointsAttempted / totalStats.gamesPlayed,
        freeThrowsMade: totalStats.freeThrowsMade / totalStats.gamesPlayed,
        freeThrowsAttempted:
          totalStats.freeThrowsAttempted / totalStats.gamesPlayed,
        rebounds: totalStats.rebounds / totalStats.gamesPlayed,
        assists: totalStats.assists / totalStats.gamesPlayed,
        steals: totalStats.steals / totalStats.gamesPlayed,
        blocks: totalStats.blocks / totalStats.gamesPlayed,
        turnovers: totalStats.turnovers / totalStats.gamesPlayed,
        personalFouls: totalStats.personalFouls / totalStats.gamesPlayed,
        cooked: totalStats.cooked / totalStats.gamesPlayed,
      };

      return {
        ...player,
        seasons: seasons,
        totalStats: {
          ...totalStats,
          twoPointPercentage:
            totalStats.twoPointsAttempted === 0
              ? 0
              : Math.round(
                  (totalStats.twoPointsMade / totalStats.twoPointsAttempted) *
                    100
                ),
          threePointPercentage:
            totalStats.threePointsAttempted === 0
              ? 0
              : Math.round(
                  (totalStats.threePointsMade /
                    totalStats.threePointsAttempted) *
                    100
                ),
          freeThrowPercentage:
            totalStats.freeThrowsAttempted === 0
              ? 0
              : Math.round(
                  (totalStats.freeThrowsMade / totalStats.freeThrowsAttempted) *
                    100
                ),
          fieldGoalPercentage: Math.round(
            ((totalStats.twoPointsMade + totalStats.threePointsMade) /
              (totalStats.twoPointsAttempted +
                totalStats.threePointsAttempted)) *
              100
          ),
        },
        averageStats: averageStats,
      };
    } catch (error) {
      console.error("Error retrieving the player data from MongoDB: ", error);
      return null;
    }
  }

  if (method === "GET") {
    try {
      const player = await getPlayerData();

      res.status(200).json(player);
    } catch (error) {
      console.error(`${method} player request failed: ${error}`);
      res.status(500).send("Error retrieving player data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
