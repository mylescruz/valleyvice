import calculatePercentage from "@/helpers/calculatePercentage";
import clientPromise from "./mongodb";

const stats = [
  {
    statId: "gamesPlayed",
    name: "Games Played",
    key: "GP",
    type: "totals",
    statOrder: 1,
  },
  { statId: "wins", name: "Wins", key: "W", type: "totals", statOrder: 2 },
  { statId: "losses", name: "Losses", key: "L", type: "totals", statOrder: 3 },
  {
    statId: "points",
    name: "Points",
    key: "PTS",
    type: "averages",
    statOrder: 4,
  },
  {
    statId: "twoPointsMade",
    name: "Two Points Made",
    key: "2PM",
    type: "averages",
    statOrder: 5,
  },
  {
    statId: "twoPointsAttempted",
    name: "Two Points Attempted",
    key: "2PA",
    type: "averages",
    statOrder: 6,
  },
  {
    statId: "twoPointPercentage",
    name: "Two Point Percentage",
    key: "2P%",
    type: "averages",
    statOrder: 7,
  },
  {
    statId: "threePointsMade",
    name: "Three Points Made",
    key: "3PM",
    type: "averages",
    statOrder: 8,
  },
  {
    statId: "threePointsAttempted",
    name: "Three Points Attempted",
    key: "3PA",
    type: "averages",
    statOrder: 9,
  },
  {
    statId: "threePointPercentage",
    name: "Three Point Percentage",
    key: "3P%",
    type: "averages",
    statOrder: 10,
  },
  {
    statId: "freeThrowsMade",
    name: "Free Throws Made",
    key: "FTM",
    type: "averages",
    statOrder: 11,
  },
  {
    statId: "freeThrowsAttempted",
    name: "Free Throws Attempted",
    key: "FTA",
    type: "averages",
    statOrder: 12,
  },
  {
    statId: "freeThrowPercentage",
    name: "Free Throw Percentage",
    key: "FT%",
    type: "averages",
    statOrder: 13,
  },
  {
    statId: "rebounds",
    name: "Rebounds",
    key: "REB",
    type: "averages",
    statOrder: 14,
  },
  {
    statId: "assists",
    name: "Assists",
    key: "AST",
    type: "averages",
    statOrder: 15,
  },
  {
    statId: "steals",
    name: "Steals",
    key: "STL",
    type: "averages",
    statOrder: 16,
  },
  {
    statId: "blocks",
    name: "Blocks",
    key: "BLK",
    type: "averages",
    statOrder: 17,
  },
  {
    statId: "turnovers",
    name: "Turnovers",
    key: "TO",
    type: "averages",
    statOrder: 18,
  },
  {
    statId: "personalFouls",
    name: "Personal Fouls",
    key: "PF",
    type: "averages",
    statOrder: 19,
  },
  {
    statId: "cooked",
    name: "Cooked",
    key: "CKD",
    type: "averages",
    statOrder: 20,
  },
];

export default async function updateOverallTeamStats(session) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");
  const analyticsCol = db.collection("analytics");

  // Get the totals of all the team's stats over all games
  const team = await gamesCol
    .aggregate(
      [
        { $unwind: "$players" },
        {
          $group: {
            _id: {
              seasonNumber: "$seasonNumber",
              gameNumber: "$gameNumber",
              result: "$result",
              opponentScore: "$opponentScore",
            },
            totalPoints: { $sum: "$players.points" },
            totalTwoPointsMade: { $sum: "$players.twoPointsMade" },
            totalTwoPointsAttempted: { $sum: "$players.twoPointsAttempted" },
            totalThreePointsMade: { $sum: "$players.threePointsMade" },
            totalThreePointsAttempted: {
              $sum: "$players.threePointsAttempted",
            },
            totalFreeThrowsMade: { $sum: "$players.freeThrowsMade" },
            totalFreeThrowsAttempted: { $sum: "$players.freeThrowsAttempted" },
            totalRebounds: { $sum: "$players.rebounds" },
            totalAssists: { $sum: "$players.assists" },
            totalSteals: { $sum: "$players.steals" },
            totalBlocks: { $sum: "$players.blocks" },
            totalTurnovers: { $sum: "$players.turnovers" },
            totalPersonalFouls: { $sum: "$players.personalFouls" },
            totalCooked: { $sum: "$players.cooked" },
          },
        },
        {
          $group: {
            _id: null,
            gamesPlayed: { $sum: 1 },
            wins: { $sum: { $cond: [{ $eq: ["$_id.result", "W"] }, 1, 0] } },
            losses: {
              $sum: { $cond: [{ $eq: ["$_id.result", "L"] }, 1, 0] },
            },
            opponentScore: { $sum: "$_id.opponentScore" },
            points: { $sum: "$totalPoints" },
            twoPointsMade: { $sum: "$totalTwoPointsMade" },
            twoPointsAttempted: { $sum: "$totalTwoPointsAttempted" },
            threePointsMade: { $sum: "$totalThreePointsMade" },
            threePointsAttempted: { $sum: "$totalThreePointsAttempted" },
            freeThrowsMade: { $sum: "$totalFreeThrowsMade" },
            freeThrowsAttempted: { $sum: "$totalFreeThrowsAttempted" },
            rebounds: { $sum: "$totalRebounds" },
            assists: { $sum: "$totalAssists" },
            steals: { $sum: "$totalSteals" },
            blocks: { $sum: "$totalBlocks" },
            turnovers: { $sum: "$totalTurnovers" },
            personalFouls: { $sum: "$totalPersonalFouls" },
            cooked: { $sum: "$totalCooked" },
          },
        },
      ],
      { session },
    )
    .toArray();

  const teamStats = team[0];

  // Define team's career total stats
  const totalStats = {
    gamesPlayed: teamStats.gamesPlayed,
    wins: teamStats.wins,
    losses: teamStats.losses,
  };

  // Define team's career average stats
  const averageStats = {
    winPercentage: calculatePercentage(
      teamStats.wins,
      teamStats.wins + teamStats.losses,
    ),
    opponentScore: calculateAverage(
      teamStats.opponentScore,
      teamStats.gamesPlayed,
    ),
    points: calculateAverage(teamStats.points, teamStats.gamesPlayed),
    twoPointsMade: calculateAverage(
      teamStats.twoPointsMade,
      teamStats.gamesPlayed,
    ),
    twoPointsAttempted: calculateAverage(
      teamStats.twoPointsAttempted,
      teamStats.gamesPlayed,
    ),
    twoPointPercentage: calculatePercentage(
      teamStats.twoPointsMade,
      teamStats.twoPointsAttempted,
    ),
    threePointsMade: calculateAverage(
      teamStats.threePointsMade,
      teamStats.gamesPlayed,
    ),
    threePointsAttempted: calculateAverage(
      teamStats.threePointsAttempted,
      teamStats.gamesPlayed,
    ),
    threePointPercentage: calculatePercentage(
      teamStats.threePointsMade,
      teamStats.threePointsAttempted,
    ),
    freeThrowsMade: calculateAverage(
      teamStats.freeThrowsMade,
      teamStats.gamesPlayed,
    ),
    freeThrowsAttempted: calculateAverage(
      teamStats.freeThrowsAttempted,
      teamStats.gamesPlayed,
    ),
    freeThrowPercentage: calculatePercentage(
      teamStats.freeThrowsMade,
      teamStats.freeThrowsAttempted,
    ),
    rebounds: calculateAverage(teamStats.rebounds, teamStats.gamesPlayed),
    assists: calculateAverage(teamStats.assists, teamStats.gamesPlayed),
    steals: calculateAverage(teamStats.steals, teamStats.gamesPlayed),
    blocks: calculateAverage(teamStats.blocks, teamStats.gamesPlayed),
    turnovers: calculateAverage(teamStats.turnovers, teamStats.gamesPlayed),
    personalFouls: calculateAverage(
      teamStats.personalFouls,
      teamStats.gamesPlayed,
    ),
    cooked: calculateAverage(teamStats.cooked, teamStats.gamesPlayed),
  };

  const analyticsDocs = [];

  // Update the total stats for the team
  stats
    .filter((stat) => stat.type === "totals")
    .forEach((stat) => {
      analyticsDocs.push({
        subject: "team",
        valueType: "total",
        period: "career",
        statId: stat.statId,
        statKey: stat.key,
        statName: stat.name,
        statOrder: stat.statOrder,
        value: totalStats[stat.statId],
      });
    });

  // Update the average stats for the team
  stats
    .filter((stat) => stat.type === "averages")
    .forEach((stat) => {
      analyticsDocs.push({
        subject: "team",
        valueType: "average",
        period: "career",
        statId: stat.statId,
        statKey: stat.key,
        statName: stat.name,
        statOrder: stat.statOrder,
        value: averageStats[stat.statId],
      });
    });

  // Delete the previous team stats
  await analyticsCol.deleteMany({ subject: "team", period: "career" });

  await analyticsCol.insertMany(analyticsDocs, { session });

  console.log("Updated the team's overall stats");
}
