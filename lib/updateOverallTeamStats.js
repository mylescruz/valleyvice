import calculatePercentage from "@/helpers/calculatePercentage";
import clientPromise from "./mongodb";

const stats = [
  {
    statId: "seasonsPlayed",
    name: "Seasons Played",
    key: "SNs",
    type: "totals",
  },
  {
    statId: "gamesPlayed",
    name: "Games Played",
    key: "GPs",
    type: "totals",
  },
  { statId: "wins", name: "Wins", key: "W", type: "totals" },
  {
    statId: "losses",
    name: "Losses",
    key: "L",
    type: "totals",
  },
  {
    statId: "winPercentage",
    name: "Win %",
    key: "Win%",
    type: "totals",
  },
  {
    statId: "points",
    name: "Points",
    key: "PTS",
    type: "averages",
  },
  {
    statId: "twoPointsMade",
    name: "Two Points Made",
    key: "2PM",
    type: "averages",
  },
  {
    statId: "twoPointsAttempted",
    name: "Two Points Attempted",
    key: "2PA",
    type: "averages",
  },
  {
    statId: "twoPointPercentage",
    name: "Two Point Percentage",
    key: "2P%",
    type: "averages",
  },
  {
    statId: "threePointsMade",
    name: "Three Points Made",
    key: "3PM",
    type: "averages",
  },
  {
    statId: "threePointsAttempted",
    name: "Three Points Attempted",
    key: "3PA",
    type: "averages",
  },
  {
    statId: "threePointPercentage",
    name: "Three Point Percentage",
    key: "3P%",
    type: "averages",
  },
  {
    statId: "freeThrowsMade",
    name: "Free Throws Made",
    key: "FTM",
    type: "averages",
  },
  {
    statId: "freeThrowsAttempted",
    name: "Free Throws Attempted",
    key: "FTA",
    type: "averages",
  },
  {
    statId: "freeThrowPercentage",
    name: "Free Throw Percentage",
    key: "FT%",
    type: "averages",
  },
  {
    statId: "rebounds",
    name: "Rebounds",
    key: "REB",
    type: "averages",
  },
  {
    statId: "assists",
    name: "Assists",
    key: "AST",
    type: "averages",
  },
  {
    statId: "steals",
    name: "Steals",
    key: "STL",
    type: "averages",
  },
  {
    statId: "blocks",
    name: "Blocks",
    key: "BLK",
    type: "averages",
  },
  {
    statId: "turnovers",
    name: "Turnovers",
    key: "TO",
    type: "averages",
  },
  {
    statId: "personalFouls",
    name: "Personal Fouls",
    key: "PF",
    type: "averages",
  },
  {
    statId: "cooked",
    name: "Cooked",
    key: "CKD",
    type: "averages",
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
            seasons: { $addToSet: "$_id.seasonNumber" },
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
        {
          $project: {
            _id: 0,
            seasonsPlayed: { $size: "$seasons" },
            gamesPlayed: 1,
            wins: 1,
            losses: 1,
            opponentScore: 1,
            points: 1,
            twoPointsMade: 1,
            twoPointsAttempted: 1,
            threePointsMade: 1,
            threePointsAttempted: 1,
            freeThrowsMade: 1,
            freeThrowsAttempted: 1,
            rebounds: 1,
            assists: 1,
            steals: 1,
            blocks: 1,
            turnovers: 1,
            personalFouls: 1,
            cooked: 1,
          },
        },
      ],
      { session },
    )
    .toArray();

  const teamStats = team[0];

  // Get the team's overall total stats
  const totalStats = {
    seasonsPlayed: teamStats.seasonsPlayed,
    gamesPlayed: teamStats.gamesPlayed,
    wins: teamStats.wins,
    losses: teamStats.losses,
    winPercentage: calculatePercentage(
      teamStats.wins,
      teamStats.wins + teamStats.losses,
    ),
  };

  // Calculate the team's overall average stats
  const averageStats = {
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
    .forEach((stat, index) => {
      analyticsDocs.push({
        subject: "team",
        valueType: "total",
        period: "career",
        statId: stat.statId,
        statKey: stat.key,
        statName: stat.name,
        statOrder: index + 1,
        value: totalStats[stat.statId],
      });
    });

  // Update the average stats for the team
  stats
    .filter((stat) => stat.type === "averages")
    .forEach((stat, index) => {
      analyticsDocs.push({
        subject: "team",
        valueType: "average",
        period: "career",
        statId: stat.statId,
        statKey: stat.key,
        statName: stat.name,
        statOrder: index + 1,
        value: averageStats[stat.statId],
      });
    });

  await analyticsCol.deleteMany(
    { subject: "team", period: "career" },
    { session },
  );

  await analyticsCol.insertMany(analyticsDocs, { session });

  console.log("Updated the team's overall stats");
}
