import calculateAverage from "@/helpers/calculateAverage";
import clientPromise from "./mongodb";
import calculatePercentage from "@/helpers/calculatePercentage";

const stats = [
  { name: "gamesPlayed", type: "totals" },
  { name: "points", type: "both" },
  { name: "twoPointsMade", type: "both" },
  { name: "twoPointsAttempted", type: "both" },
  { name: "twoPointPercentage", type: "averages" },
  { name: "threePointsMade", type: "both" },
  { name: "threePointsAttempted", type: "both" },
  { name: "threePointPercentage", type: "averages" },
  { name: "freeThrowsMade", type: "both" },
  { name: "freeThrowsAttempted", type: "both" },
  { name: "freeThrowPercentage", type: "averages" },
  { name: "rebounds", type: "both" },
  { name: "assists", type: "both" },
  { name: "steals", type: "both" },
  { name: "blocks", type: "both" },
  { name: "turnovers", type: "both" },
  { name: "personalFouls", type: "both" },
  { name: "cooked", type: "both" },
];

export async function updatePlayerRanks({ session }) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const playersCol = db.collection("players");
  const analyticsCol = db.collection("analytics");

  // Get all time total and average leaders for each stat with at least 5 games played
  const playerTotals = await playersCol
    .aggregate(
      [
        {
          $project: {
            playerId: 1,
            name: 1,
            number: 1,
            imageSrc: 1,
            imageAlt: 1,
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
      ],
      { session },
    )
    .toArray();

  // Map each player with their total and average stats
  const players = playerTotals.map((player) => {
    return {
      playerId: player.playerId,
      name: player.name,
      number: player.number,
      imageSrc: player.imageSrc,
      imageAlt: player.imageAlt,
      totals: {
        gamesPlayed: player.totalGamesPlayed,
        points: player.totalPoints,
        twoPointsMade: player.totalTwoPointsMade,
        twoPointsAttempted: player.totalTwoPointsAttempted,
        threePointsMade: player.totalThreePointsMade,
        threePointsAttempted: player.totalThreePointsAttempted,
        freeThrowsMade: player.totalFreeThrowsMade,
        freeThrowsAttempted: player.totalFreeThrowsAttempted,
        rebounds: player.totalRebounds,
        assists: player.totalAssists,
        steals: player.totalSteals,
        blocks: player.totalBlocks,
        turnovers: player.totalTurnovers,
        personalFouls: player.totalPersonalFouls,
        cooked: player.totalCooked,
      },
      averages: {
        points: calculateAverage(player.totalPoints, player.totalGamesPlayed),
        twoPointsMade: calculateAverage(
          player.totalTwoPointsMade,
          player.totalGamesPlayed,
        ),
        twoPointsAttempted: calculateAverage(
          player.totalTwoPointsAttempted,
          player.totalGamesPlayed,
        ),
        twoPointPercentage: calculatePercentage(
          player.totalTwoPointsMade,
          player.totalTwoPointsAttempted,
        ),
        threePointsMade: calculateAverage(
          player.totalThreePointsMade,
          player.totalGamesPlayed,
        ),
        threePointsAttempted: calculateAverage(
          player.totalThreePointsAttempted,
          player.totalGamesPlayed,
        ),
        threePointPercentage: calculatePercentage(
          player.totalThreePointsMade,
          player.totalThreePointsAttempted,
        ),
        freeThrowsMade: calculateAverage(
          player.totalFreeThrowsMade,
          player.totalGamesPlayed,
        ),
        freeThrowsAttempted: calculateAverage(
          player.totalFreeThrowsAttempted,
          player.totalGamesPlayed,
        ),
        freeThrowPercentage: calculatePercentage(
          player.totalFreeThrowsMade,
          player.totalFreeThrowsAttempted,
        ),
        rebounds: calculateAverage(
          player.totalRebounds,
          player.totalGamesPlayed,
        ),
        assists: calculateAverage(player.totalAssists, player.totalGamesPlayed),
        steals: calculateAverage(player.totalSteals, player.totalGamesPlayed),
        blocks: calculateAverage(player.totalBlocks, player.totalGamesPlayed),
        turnovers: calculateAverage(
          player.totalTurnovers,
          player.totalGamesPlayed,
        ),
        personalFouls: calculateAverage(
          player.totalPersonalFouls,
          player.totalGamesPlayed,
        ),
        cooked: calculateAverage(player.totalCooked, player.totalGamesPlayed),
      },
    };
  });

  const analyticsDocs = [];

  // Rank the players based on their total stats
  stats
    .filter((stat) => stat.type === "totals" || stat.type === "both")
    .forEach((stat) => {
      const sortedPlayerTotals = [...players]
        .filter((player) => player.totals[stat.name] > 0)
        .sort((a, b) => {
          return b.totals[stat.name] - a.totals[stat.name];
        });

      sortedPlayerTotals.forEach((player, index) => {
        analyticsDocs.push({
          subject: "player",
          valueType: "total",
          period: "career",
          stat: stat.name,
          playerId: player.playerId,
          name: player.name,
          imageSrc: player.imageSrc,
          imageAlt: player.imageAlt,
          value: player.totals[stat.name],
          rank: index + 1,
        });
      });
    });

  // Rank the players based on their average stats
  stats
    .filter((stat) => stat.type === "average" || stat.type === "both")
    .forEach((stat) => {
      const sortedPlayerAverages = [...players]
        .filter((player) => player.averages[stat.name] > 0)
        .sort((a, b) => {
          return b.averages[stat.name] - a.averages[stat.name];
        });

      sortedPlayerAverages.forEach((player, index) => {
        analyticsDocs.push({
          subject: "player",
          valueType: "average",
          period: "career",
          stat: stat.name,
          playerId: player.playerId,
          name: player.name,
          imageSrc: player.imageSrc,
          imageAlt: player.imageAlt,
          value: player.averages[stat.name],
          rank: index + 1,
        });
      });
    });

  await analyticsCol.deleteMany({}, { session });

  const insertResult = await analyticsCol.insertMany(analyticsDocs, {
    session,
  });

  console.log(insertResult);
}
