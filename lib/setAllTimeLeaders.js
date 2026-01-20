import clientPromise from "./mongodb";

export async function setAllTimeLeaders({ session }) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const playersCol = db.collection("players");
  const leadersCol = db.collection("leaders");

  // Get all time total and average leaders for each stat with at least 5 games played
  const players = await playersCol
    .aggregate(
      [
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
        { $match: { totalGamesPlayed: { $gte: 5 } } },
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
      ],
      { session },
    )
    .toArray();

  const statLeader = (players, stat, label, type) => {
    const leaders = players.reduce((a, b) => (b[stat] > a[stat] ? b : a));

    return {
      type: type,
      stat: label,
      playerId: leaders.playerId,
      name: leaders.name,
      value: leaders[stat],
    };
  };

  const leaders = [
    statLeader(players, "totalPoints", "PTS", "total"),
    statLeader(players, "totalTwoPointsMade", "2PM", "total"),
    statLeader(players, "totalTwoPointsAttempted", "2PA", "total"),
    statLeader(players, "totalThreePointsMade", "3PM", "total"),
    statLeader(players, "totalThreePointsAttempted", "3PA", "total"),
    statLeader(players, "totalFreeThrowsMade", "FTM", "total"),
    statLeader(players, "totalFreeThrowsAttempted", "FTA", "total"),
    statLeader(players, "totalRebounds", "REB", "total"),
    statLeader(players, "totalAssists", "AST", "total"),
    statLeader(players, "totalSteals", "STL", "total"),
    statLeader(players, "totalBlocks", "BLK", "total"),
    statLeader(players, "totalTurnovers", "TO", "total"),
    statLeader(players, "totalPersonalFouls", "PF", "total"),
    statLeader(players, "totalCooked", "CKD", "total"),
    statLeader(players, "avgPoints", "PTS", "average"),
    statLeader(players, "avgTwoPointsMade", "2PM", "average"),
    statLeader(players, "avgTwoPointsAttempted", "2PA", "average"),
    statLeader(players, "avgThreePointsMade", "3PM", "average"),
    statLeader(players, "avgThreePointsAttempted", "3PA", "average"),
    statLeader(players, "avgFreeThrowsMade", "FTM", "average"),
    statLeader(players, "avgFreeThrowsAttempted", "FTA", "average"),
    statLeader(players, "avgRebounds", "REB", "average"),
    statLeader(players, "avgAssists", "AST", "average"),
    statLeader(players, "avgSteals", "STL", "average"),
    statLeader(players, "avgBlocks", "BLK", "average"),
    statLeader(players, "avgTurnovers", "TO", "average"),
    statLeader(players, "avgPersonalFouls", "PF", "average"),
    statLeader(players, "avgCooked", "CKD", "average"),
  ];

  const result = await leadersCol.insertMany(leaders, { session });
  console.log(result);
}
