import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const method = req?.method;

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");
  const playersCol = db.collection("players");

  // Get how many total games, total wins and total losses against opponents
  const getOpponentsData = async () => {
    try {
      const opponents = await gamesCol
        .aggregate([
          { $match: { result: { $ne: null } } },
          { $project: { opponent: 1, result: 1 } },
          {
            $group: {
              _id: "$opponent",
              games: { $sum: 1 },
              wins: {
                $sum: { $cond: [{ $eq: ["$result", "W"] }, 1, 0] },
              },
              losses: {
                $sum: { $cond: [{ $eq: ["$result", "L"] }, 1, 0] },
              },
            },
          },
          { $match: { games: { $gt: 2 } } },
          {
            $project: {
              opponent: "$_id",
              games: 1,
              wins: 1,
              losses: 1,
              _id: 0,
            },
          },
          { $sort: { games: -1 } },
        ])
        .toArray();

      return opponents;
    } catch (error) {
      console.error(`Error getting opponent data from MongoDB: ${error}`);
      throw new Error(error);
    }
  };

  // Get all time total and average leaders for each stat
  const getLeaders = async () => {
    const players = await playersCol
      .aggregate([
        {
          $project: {
            playerId: 1,
            name: 1,
            number: 1,
            seasons: 1,
            totalGamesPlayed: { $sum: "$seasons.gamesPlayed" },
            totalPoints: { $sum: "$seasons.points" },
            totalTwoPointsMade: { $sum: "$seasons.twoPointsMade" },
            totalTwoPointsAttempted: { $sum: "$seasons.twoPointsAttempted" },
            totalThreePointsMade: { $sum: "$seasons.threePointsMade" },
            totalThreePointsAttempted: {
              $sum: "$seasons.threePointsAttempted",
            },
            totalFreeThrowsMade: { $sum: "$seasons.freeThrowsMade" },
            totalFreeThrowsAttempted: { $sum: "$seasons.freeThrowsAttempted" },
            totalRebounds: { $sum: "$seasons.rebounds" },
            totalAssists: { $sum: "$seasons.assists" },
            totalSteals: { $sum: "$seasons.steals" },
            totalBlocks: { $sum: "$seasons.blocks" },
            totalTurnovers: { $sum: "$seasons.turnovers" },
            totalPersonalFouls: { $sum: "$seasons.personalFouls" },
            totalCooked: { $sum: "$seasons.cooked" },
            _id: 0,
          },
        },
        {
          $project: {
            playerId: 1,
            name: 1,
            number: 1,
            totalGamesPlayed: 1,
            totalPoints: 1,
            totalTwoPointsMade: 1,
            totalTwoPointsAttempted: 1,
            totalThreePointsMade: 1,
            totalThreePointsAttempted: 1,
            totalFreeThrowsMade: 1,
            totalFreeThrowsAttempted: 1,
            totalRebounds: 1,
            totalAssists: 1,
            totalSteals: 1,
            totalBlocks: 1,
            totalTurnovers: 1,
            totalPersonalFouls: 1,
            totalCooked: 1,
            avgPoints: {
              $round: [{ $divide: ["$totalPoints", "$totalGamesPlayed"] }, 2],
            },
            avgTwoPointsMade: {
              $round: [
                {
                  $divide: ["$totalTwoPointsMade", "$totalGamesPlayed"],
                },
                2,
              ],
            },
            avgTwoPointsAttempted: {
              $round: [
                {
                  $divide: ["$totalTwoPointsAttempted", "$totalGamesPlayed"],
                },
                2,
              ],
            },
            avgThreePointsMade: {
              $round: [
                {
                  $divide: ["$totalThreePointsMade", "$totalGamesPlayed"],
                },
                2,
              ],
            },
            avgThreePointsAttempted: {
              $round: [
                {
                  $divide: ["$totalThreePointsAttempted", "$totalGamesPlayed"],
                },
                2,
              ],
            },
            avgFreeThrowsMade: {
              $round: [
                {
                  $divide: ["$totalFreeThrowsMade", "$totalGamesPlayed"],
                },
                2,
              ],
            },
            avgFreeThrowsAttempted: {
              $round: [
                {
                  $divide: ["$totalFreeThrowsAttempted", "$totalGamesPlayed"],
                },
                2,
              ],
            },
            avgRebounds: {
              $round: [{ $divide: ["$totalRebounds", "$totalGamesPlayed"] }, 2],
            },
            avgAssists: {
              $round: [{ $divide: ["$totalAssists", "$totalGamesPlayed"] }, 2],
            },
            avgSteals: {
              $round: [{ $divide: ["$totalSteals", "$totalGamesPlayed"] }, 2],
            },
            avgBlocks: {
              $round: [{ $divide: ["$totalBlocks", "$totalGamesPlayed"] }, 2],
            },
            avgTurnovers: {
              $round: [
                {
                  $divide: ["$totalTurnovers", "$totalGamesPlayed"],
                },
                2,
              ],
            },
            avgPersonalFouls: {
              $round: [
                {
                  $divide: ["$totalPersonalFouls", "$totalGamesPlayed"],
                },
                2,
              ],
            },
            avgCooked: {
              $round: [{ $divide: ["$totalCooked", "$totalGamesPlayed"] }, 2],
            },
            _id: 0,
          },
        },
        { $sort: { avgPointsPerGame: -1 } },
      ])
      .toArray();

    const statLeader = (players, stat, label) => {
      const leaders = players.reduce((a, b) => (b[stat] > a[stat] ? b : a));

      return {
        stat: label,
        playerId: leaders.playerId,
        name: leaders.name,
        value: leaders[stat],
      };
    };

    return {
      totalLeaders: [
        statLeader(players, "totalPoints", "PTS"),
        statLeader(players, "totalTwoPointsMade", "2PM"),
        statLeader(players, "totalTwoPointsAttempted", "2PA"),
        statLeader(players, "totalThreePointsMade", "3PM"),
        statLeader(players, "totalThreePointsAttempted", "3PA"),
        statLeader(players, "totalFreeThrowsMade", "FTM"),
        statLeader(players, "totalFreeThrowsAttempted", "FTA"),
        statLeader(players, "totalRebounds", "REB"),
        statLeader(players, "totalAssists", "AST"),
        statLeader(players, "totalSteals", "STL"),
        statLeader(players, "totalBlocks", "BLK"),
        statLeader(players, "totalTurnovers", "TO"),
        statLeader(players, "totalPersonalFouls", "PF"),
        statLeader(players, "totalCooked", "CKD"),
      ],
      avgLeaders: [
        statLeader(players, "avgPoints", "PTS"),
        statLeader(players, "avgTwoPointsMade", "2PM"),
        statLeader(players, "avgTwoPointsAttempted", "2PA"),
        statLeader(players, "avgThreePointsMade", "3PM"),
        statLeader(players, "avgThreePointsAttempted", "3PA"),
        statLeader(players, "avgFreeThrowsMade", "FTM"),
        statLeader(players, "avgFreeThrowsAttempted", "FTA"),
        statLeader(players, "avgRebounds", "REB"),
        statLeader(players, "avgAssists", "AST"),
        statLeader(players, "avgSteals", "STL"),
        statLeader(players, "avgBlocks", "BLK"),
        statLeader(players, "avgTurnovers", "TO"),
        statLeader(players, "avgPersonalFouls", "PF"),
        statLeader(players, "avgCooked", "CKD"),
      ],
    };
  };

  if (method === "GET") {
    try {
      // Get opponents data
      const opponents = await getOpponentsData();

      // Get all time leaders data
      const allTimeLeaders = await getLeaders();

      const analytics = {
        opponents: opponents,
        allTimeLeaders: allTimeLeaders,
      };

      // Send retrieved analytics back to the client
      res.status(200).json(analytics);
    } catch (error) {
      console.error(`${method} analytics request failed: ${error}`);
      res.status(500).send("Error retrieving analytics data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
