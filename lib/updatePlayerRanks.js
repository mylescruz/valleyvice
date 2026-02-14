import calculateAverage from "@/helpers/calculateAverage";
import clientPromise from "./mongodb";
import calculatePercentage from "@/helpers/calculatePercentage";

const stats = [
  {
    statId: "gamesPlayed",
    name: "Games Played",
    key: "GP",
    type: "totals",
    statOrder: 1,
  },
  {
    statId: "points",
    name: "Points",
    key: "PTS",
    type: "both",
    statOrder: 2,
  },
  {
    statId: "twoPointsMade",
    name: "Two Points Made",
    key: "2PM",
    type: "both",
    statOrder: 3,
  },
  {
    statId: "twoPointsAttempted",
    name: "Two Points Attempted",
    key: "2PA",
    type: "both",
    statOrder: 4,
  },
  {
    statId: "twoPointPercentage",
    name: "Two Point Percentage",
    key: "2P%",
    type: "averages",
    statOrder: 5,
  },
  {
    statId: "threePointsMade",
    name: "Three Points Made",
    key: "3PM",
    type: "both",
    statOrder: 6,
  },
  {
    statId: "threePointsAttempted",
    name: "Three Points Attempted",
    key: "3PA",
    type: "both",
    statOrder: 7,
  },
  {
    statId: "threePointPercentage",
    name: "Three Point Percentage",
    key: "3P%",
    type: "averages",
    statOrder: 8,
  },
  {
    statId: "freeThrowsMade",
    name: "Free Throws Made",
    key: "FTM",
    type: "both",
    statOrder: 9,
  },
  {
    statId: "freeThrowsAttempted",
    name: "Free Throws Attempted",
    key: "FTA",
    type: "both",
    statOrder: 10,
  },
  {
    statId: "freeThrowPercentage",
    name: "Free Throw Percentage",
    key: "FT%",
    type: "averages",
    statOrder: 11,
  },
  {
    statId: "rebounds",
    name: "Rebounds",
    key: "REB",
    type: "both",
    statOrder: 12,
  },
  {
    statId: "assists",
    name: "Assists",
    key: "AST",
    type: "both",
    statOrder: 13,
  },
  {
    statId: "steals",
    name: "Steals",
    key: "STL",
    type: "both",
    statOrder: 14,
  },
  {
    statId: "blocks",
    name: "Blocks",
    key: "BLK",
    type: "both",
    statOrder: 15,
  },
  {
    statId: "turnovers",
    name: "Turnovers",
    key: "TO",
    type: "both",
    statOrder: 16,
  },
  {
    statId: "personalFouls",
    name: "Personal Fouls",
    key: "PF",
    type: "both",
    statOrder: 17,
  },
  {
    statId: "cooked",
    name: "Cooked",
    key: "CKD",
    type: "both",
    statOrder: 18,
  },
];

export async function updatePlayerRanks({ session }) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const playersCol = db.collection("players");
  const analyticsCol = db.collection("analytics");

  // Get all time total and average leaders for each stat with at least 5 games played
  const playerTotals = await playersCol
    .aggregate([
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
      { session },
    ])
    .toArray();

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
        .filter((player) => player.totals[stat.statId] > 0)
        .sort((a, b) => {
          return b.totals[stat.statId] - a.totals[stat.statId];
        });

      sortedPlayerTotals.forEach((player, index) => {
        analyticsDocs.push({
          subject: "player",
          valueType: "total",
          period: "career",
          statId: stat.statId,
          statKey: stat.key,
          statName: stat.name,
          statOrder: stat.statOrder,
          playerId: player.playerId,
          name: player.name,
          imageSrc: player.imageSrc,
          imageAlt: player.imageAlt,
          value: player.totals[stat.statId],
          rank: index + 1,
        });
      });
    });

  // Rank the players based on their average stats
  stats
    .filter((stat) => stat.type === "averages" || stat.type === "both")
    .forEach((stat) => {
      const sortedPlayerAverages = [...players]
        .filter((player) => player.averages[stat.statId] > 0)
        .sort((a, b) => {
          return b.averages[stat.statId] - a.averages[stat.statId];
        });

      sortedPlayerAverages.forEach((player, index) => {
        analyticsDocs.push({
          subject: "player",
          valueType: "average",
          period: "career",
          statId: stat.statId,
          statKey: stat.key,
          statName: stat.name,
          statOrder: stat.statOrder,
          playerId: player.playerId,
          name: player.name,
          imageSrc: player.imageSrc,
          imageAlt: player.imageAlt,
          value: player.averages[stat.statId],
          rank: index + 1,
        });
      });
    });

  await analyticsCol.deleteMany({}, { session });

  const result = await analyticsCol.insertMany(analyticsDocs, { session });

  console.log(result);
}
