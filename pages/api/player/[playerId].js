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
          twoPointPercentage:
            season.twoPointsAttempted === 0
              ? 0
              : (
                  (season.twoPointsMade / season.twoPointsAttempted) *
                  100
                ).toFixed(0),
          threePointPercentage:
            season.threePointsAttempted === 0
              ? 0
              : (
                  (season.threePointsMade / season.threePointsAttempted) *
                  100
                ).toFixed(0),
          freeThrowPercentage:
            season.freeThrowsAttempted === 0
              ? 0
              : (
                  (season.freeThrowsMade / season.freeThrowsAttempted) *
                  100
                ).toFixed(0),
          averageStats: {
            seasonNumber: season.seasonNumber,
            gamesPlayed: season.gamesPlayed,
            points: (season.points / season.gamesPlayed).toFixed(2),
            twoPointsMade: (season.twoPointsMade / season.gamesPlayed).toFixed(
              2
            ),
            twoPointsAttempted: (
              season.twoPointsAttempted / season.gamesPlayed
            ).toFixed(2),
            threePointsMade: (
              season.threePointsMade / season.gamesPlayed
            ).toFixed(2),
            threePointsAttempted: (
              season.threePointsAttempted / season.gamesPlayed
            ).toFixed(2),
            freeThrowsMade: (
              season.freeThrowsMade / season.gamesPlayed
            ).toFixed(2),
            freeThrowsAttempted: (
              season.freeThrowsAttempted / season.gamesPlayed
            ).toFixed(2),
            rebounds: (season.rebounds / season.gamesPlayed).toFixed(2),
            assists: (season.assists / season.gamesPlayed).toFixed(2),
            steals: (season.steals / season.gamesPlayed).toFixed(2),
            blocks: (season.blocks / season.gamesPlayed).toFixed(2),
            turnovers: (season.turnovers / season.gamesPlayed).toFixed(2),
            personalFouls: (season.personalFouls / season.gamesPlayed).toFixed(
              2
            ),
            cooked: (season.cooked / season.gamesPlayed).toFixed(2),
          },
        };
      });

      const averageStats = {
        gamesPlayed: totalStats.gamesPlayed,
        points: (totalStats.points / totalStats.gamesPlayed).toFixed(2),
        twoPointsMade: (
          totalStats.twoPointsMade / totalStats.gamesPlayed
        ).toFixed(2),
        twoPointsAttempted: (
          totalStats.twoPointsAttempted / totalStats.gamesPlayed
        ).toFixed(2),
        threePointsMade: (
          totalStats.threePointsMade / totalStats.gamesPlayed
        ).toFixed(2),
        threePointsAttempted: (
          totalStats.threePointsAttempted / totalStats.gamesPlayed
        ).toFixed(2),
        freeThrowsMade: (
          totalStats.freeThrowsMade / totalStats.gamesPlayed
        ).toFixed(2),
        freeThrowsAttempted: (
          totalStats.freeThrowsAttempted / totalStats.gamesPlayed
        ).toFixed(2),
        rebounds: (totalStats.rebounds / totalStats.gamesPlayed).toFixed(2),
        assists: (totalStats.assists / totalStats.gamesPlayed).toFixed(2),
        steals: (totalStats.steals / totalStats.gamesPlayed).toFixed(2),
        blocks: (totalStats.blocks / totalStats.gamesPlayed).toFixed(2),
        turnovers: (totalStats.turnovers / totalStats.gamesPlayed).toFixed(2),
        personalFouls: (
          totalStats.personalFouls / totalStats.gamesPlayed
        ).toFixed(2),
        cooked: (totalStats.cooked / totalStats.gamesPlayed).toFixed(2),
      };

      return {
        ...player,
        seasons: seasons,
        totalStats: {
          ...totalStats,
          twoPointPercentage:
            totalStats.twoPointsAttempted === 0
              ? 0
              : (
                  (totalStats.twoPointsMade / totalStats.twoPointsAttempted) *
                  100
                ).toFixed(0),
          threePointPercentage:
            totalStats.threePointsAttempted === 0
              ? 0
              : (
                  (totalStats.threePointsMade /
                    totalStats.threePointsAttempted) *
                  100
                ).toFixed(0),
          freeThrowPercentage:
            totalStats.freeThrowsAttempted === 0
              ? 0
              : (
                  (totalStats.freeThrowsMade / totalStats.freeThrowsAttempted) *
                  100
                ).toFixed(0),
          fieldGoalPercentage: (
            ((totalStats.twoPointsMade + totalStats.threePointsMade) /
              (totalStats.twoPointsAttempted +
                totalStats.threePointsAttempted)) *
            100
          ).toFixed(0),
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
