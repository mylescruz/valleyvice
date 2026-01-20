import clientPromise from "./mongodb";

export async function updateSeasonStats({ seasonNumber, session }) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");
  const seasonStatsCol = db.collection("seasonStats");

  // Get season stats
  const seasonStats = await gamesCol
    .aggregate(
      [
        { $match: { seasonNumber: seasonNumber } },
        { $project: { seasonNumber: 1, gameNumber: 1, players: 1 } },
        { $unwind: "$players" },
        {
          $group: {
            _id: {
              seasonNumber: "$seasonNumber",
              playerId: "$players.playerId",
              name: "$players.name",
              number: "$players.number",
            },
            gamesPlayed: { $sum: 1 },
            points: { $sum: "$players.points" },
            twoPointsMade: { $sum: "$players.twoPointsMade" },
            twoPointsAttempted: { $sum: "$players.twoPointsAttempted" },
            threePointsMade: { $sum: "$players.threePointsMade" },
            threePointsAttempted: { $sum: "$players.threePointsAttempted" },
            freeThrowsMade: { $sum: "$players.freeThrowsMade" },
            freeThrowsAttempted: { $sum: "$players.freeThrowsAttempted" },
            rebounds: { $sum: "$players.rebounds" },
            assists: { $sum: "$players.assists" },
            steals: { $sum: "$players.steals" },
            blocks: { $sum: "$players.blocks" },
            turnovers: { $sum: "$players.turnovers" },
            personalFouls: { $sum: "$players.personalFouls" },
            cooked: { $sum: "$players.cooked" },
          },
        },
        {
          $project: {
            seasonNumber: "$_id.seasonNumber",
            playerId: "$_id.playerId",
            name: "$_id.name",
            number: "$_id.number",
            gamesPlayed: 1,
            totalStats: {
              points: "$points",
              twoPointsMade: "$twoPointsMade",
              twoPointsAttempted: "$twoPointsAttempted",
              twoPointPercentage: {
                $cond: [
                  { $eq: ["$twoPointsAttempted", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: ["$twoPointsMade", "$twoPointsAttempted"],
                          },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
              threePointsMade: "$threePointsMade",
              threePointsAttempted: "$threePointsAttempted",
              threePointPercentage: {
                $cond: [
                  { $eq: ["$threePointsAttempted", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              "$threePointsMade",
                              "$threePointsAttempted",
                            ],
                          },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
              freeThrowsMade: "$freeThrowsMade",
              freeThrowsAttempted: "$freeThrowsAttempted",
              freeThrowPercentage: {
                $cond: [
                  { $eq: ["$freeThrowsAttempted", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              "$freeThrowsMade",
                              "$freeThrowsAttempted",
                            ],
                          },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
              rebounds: "$rebounds",
              assists: "$assists",
              steals: "$steals",
              blocks: "$blocks",
              turnovers: "$turnovers",
              personalFouls: "$personalFouls",
              cooked: "$cooked",
            },
            averageStats: {
              points: { $round: [{ $divide: ["$points", "$gamesPlayed"] }, 2] },
              twoPointsMade: {
                $round: [{ $divide: ["$twoPointsMade", "$gamesPlayed"] }, 2],
              },
              twoPointsAttempted: {
                $round: [
                  { $divide: ["$twoPointsAttempted", "$gamesPlayed"] },
                  2,
                ],
              },
              threePointsMade: {
                $round: [{ $divide: ["$threePointsMade", "$gamesPlayed"] }, 2],
              },
              threePointsAttempted: {
                $round: [
                  { $divide: ["$threePointsAttempted", "$gamesPlayed"] },
                  2,
                ],
              },
              freeThrowsMade: {
                $round: [{ $divide: ["$freeThrowsMade", "$gamesPlayed"] }, 2],
              },
              freeThrowsAttempted: {
                $round: [
                  { $divide: ["$freeThrowsAttempted", "$gamesPlayed"] },
                  2,
                ],
              },
              rebounds: {
                $round: [{ $divide: ["$rebounds", "$gamesPlayed"] }, 2],
              },
              assists: {
                $round: [{ $divide: ["$assists", "$gamesPlayed"] }, 2],
              },
              steals: {
                $round: [{ $divide: ["$steals", "$gamesPlayed"] }, 2],
              },
              blocks: {
                $round: [{ $divide: ["$blocks", "$gamesPlayed"] }, 2],
              },
              turnovers: {
                $round: [{ $divide: ["$turnovers", "$gamesPlayed"] }, 2],
              },
              personalFouls: {
                $round: [{ $divide: ["$personalFouls", "$gamesPlayed"] }, 2],
              },
              cooked: {
                $round: [{ $divide: ["$cooked", "$gamesPlayed"] }, 2],
              },
            },
            _id: 0,
          },
        },
        { $sort: { number: 1 } },
        { $group: { _id: "$seasonNumber", players: { $push: "$$ROOT" } } },
        { $project: { seasonNumber: "$_id", players: 1, _id: 0 } },
        { $unwind: "$players" },
        {
          $group: {
            _id: "$seasonNumber",
            players: { $push: "$players" },
            points: { $sum: "$players.totalStats.points" },
            twoPointsMade: { $sum: "$players.totalStats.twoPointsMade" },
            twoPointsAttempted: {
              $sum: "$players.totalStats.twoPointsAttempted",
            },
            threePointsMade: { $sum: "$players.totalStats.threePointsMade" },
            threePointsAttempted: {
              $sum: "$players.totalStats.threePointsAttempted",
            },
            freeThrowsMade: { $sum: "$players.totalStats.freeThrowsMade" },
            freeThrowsAttempted: {
              $sum: "$players.totalStats.freeThrowsAttempted",
            },
            rebounds: { $sum: "$players.totalStats.rebounds" },
            assists: { $sum: "$players.totalStats.assists" },
            steals: { $sum: "$players.totalStats.steals" },
            blocks: { $sum: "$players.totalStats.blocks" },
            turnovers: { $sum: "$players.totalStats.turnovers" },
            personalFouls: { $sum: "$players.totalStats.personalFouls" },
            cooked: { $sum: "$players.totalStats.cooked" },
          },
        },
        {
          $project: {
            seasonNumber: "$_id",
            players: {
              $sortArray: {
                input: "$players",
                sortBy: { number: 1 },
              },
            },
            totalStats: {
              points: "$points",
              twoPointsMade: "$twoPointsMade",
              twoPointsAttempted: "$twoPointsAttempted",
              twoPointPercentage: {
                $cond: [
                  { $eq: ["$twoPointsAttempted", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: ["$twoPointsMade", "$twoPointsAttempted"],
                          },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
              threePointsMade: "$threePointsMade",
              threePointsAttempted: "$threePointsAttempted",
              threePointPercentage: {
                $cond: [
                  { $eq: ["$threePointsAttempted", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              "$threePointsMade",
                              "$threePointsAttempted",
                            ],
                          },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
              freeThrowsMade: "$freeThrowsMade",
              freeThrowsAttempted: "$freeThrowsAttempted",
              freeThrowPercentage: {
                $cond: [
                  { $eq: ["$freeThrowsAttempted", 0] },
                  0,
                  {
                    $round: [
                      {
                        $multiply: [
                          {
                            $divide: [
                              "$freeThrowsMade",
                              "$freeThrowsAttempted",
                            ],
                          },
                          100,
                        ],
                      },
                      0,
                    ],
                  },
                ],
              },
              rebounds: "$rebounds",
              assists: "$assists",
              steals: "$steals",
              blocks: "$blocks",
              turnovers: "$turnovers",
              personalFouls: "$personalFouls",
              cooked: "$cooked",
            },
            _id: 0,
          },
        },
        { $sort: { seasonNumber: 1 } },
      ],
      { session },
    )
    .toArray();

  // Get the total games played for each season
  const seasonGames = await gamesCol
    .find({ seasonNumber: seasonNumber }, { session })
    .toArray();

  const gamesPlayed = seasonGames.length;

  const season = seasonStats[0];

  // Update the team's average stats
  const averageStats = {
    points: parseFloat((season.totalStats.points / gamesPlayed).toFixed(2)),
    twoPointsMade: parseFloat(
      (season.totalStats.twoPointsMade / gamesPlayed).toFixed(2),
    ),
    twoPointsAttempted: parseFloat(
      (season.totalStats.twoPointsAttempted / gamesPlayed).toFixed(2),
    ),
    threePointsMade: parseFloat(
      (season.totalStats.threePointsMade / gamesPlayed).toFixed(2),
    ),
    threePointsAttempted: parseFloat(
      (season.totalStats.threePointsAttempted / gamesPlayed).toFixed(2),
    ),
    freeThrowsMade: parseFloat(
      (season.totalStats.freeThrowsMade / gamesPlayed).toFixed(2),
    ),
    freeThrowsAttempted: parseFloat(
      (season.totalStats.freeThrowsAttempted / gamesPlayed).toFixed(2),
    ),
    rebounds: parseFloat((season.totalStats.rebounds / gamesPlayed).toFixed(2)),
    assists: parseFloat((season.totalStats.assists / gamesPlayed).toFixed(2)),
    steals: parseFloat((season.totalStats.steals / gamesPlayed).toFixed(2)),
    blocks: parseFloat((season.totalStats.blocks / gamesPlayed).toFixed(2)),
    turnovers: parseFloat(
      (season.totalStats.turnovers / gamesPlayed).toFixed(2),
    ),
    personalFouls: parseFloat(
      (season.totalStats.personalFouls / gamesPlayed).toFixed(2),
    ),
    cooked: parseFloat((season.totalStats.cooked / gamesPlayed).toFixed(2)),
  };

  const finalStats = {
    seasonNumber: season.seasonNumber,
    players: season.players.sort(
      (player1, player2) => player1.number - player2.number,
    ),
    teamStats: {
      gamesPlayed: gamesPlayed,
      totalStats: season.totalStats,
      averageStats: averageStats,
    },
  };

  const updateSeasonStats = await seasonStatsCol.updateOne(
    { seasonNumber: seasonNumber },
    {
      $set: {
        players: finalStats.players,
        teamStats: finalStats.teamStats,
      },
    },
    { session },
  );

  console.log(updateSeasonStats);
}
