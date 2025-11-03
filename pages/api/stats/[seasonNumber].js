import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const method = req?.method;
  const seasonNumber = parseInt(req?.query?.seasonNumber);

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");

  // Function to get all the stats for given season
  async function getSeasonStats(seasonNumber) {
    // Get stats from MongoDB based on the seasonNumber
    const games = await gamesCol.find({ seasonNumber: seasonNumber }).toArray();

    const players = [];

    const gamesPlayed = games.length;

    let totalStats = {
      points: 0,
      twoPointsMade: 0,
      twoPointsAttempted: 0,
      twoPointPercentage: 0,
      threePointsMade: 0,
      threePointsAttempted: 0,
      threePointPercentage: 0,
      freeThrowsMade: 0,
      freeThrowsAttempted: 0,
      freeThrowPercentage: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      personalFouls: 0,
      cooked: 0,
    };

    games.forEach((game) => {
      game.players.forEach((player) => {
        const foundPlayer = players.find((p) => player.playerId === p.playerId);

        if (!foundPlayer) {
          // Add the player to the season stats object
          players.push({
            playerId: player.playerId,
            name: player.name,
            number: player.number,
            gamesPlayed: 1,
            totalStats: {
              points: player.points,
              twoPointsMade: player.twoPointsMade,
              twoPointsAttempted: player.twoPointsAttempted,
              twoPointPercentage:
                player.twoPointsAttempted !== 0
                  ? (
                      (player.twoPointsMade / player.twoPointsAttempted) *
                      100
                    ).toFixed(0)
                  : "0",
              threePointsMade: player.threePointsMade,
              threePointsAttempted: player.threePointsAttempted,
              threePointPercentage:
                player.threePointsAttempted !== 0
                  ? (
                      (player.threePointsMade / player.threePointsAttempted) *
                      100
                    ).toFixed(0)
                  : "0",
              freeThrowsMade: player.freeThrowsMade,
              freeThrowsAttempted: player.freeThrowsAttempted,
              freeThrowPercentage:
                player.freeThrowsAttempted !== 0
                  ? (
                      (player.freeThrowsMade / player.freeThrowsAttempted) *
                      100
                    ).toFixed(0)
                  : "0",
              rebounds: player.rebounds,
              assists: player.assists,
              steals: player.steals,
              blocks: player.blocks,
              turnovers: player.turnovers,
              personalFouls: player.personalFouls,
              cooked: player.cooked,
            },
            averageStats: {
              points: player.points.toFixed(2),
              twoPointsMade: player.twoPointsMade.toFixed(2),
              twoPointsAttempted: player.twoPointsAttempted.toFixed(2),
              threePointsMade: player.threePointsMade.toFixed(2),
              threePointsAttempted: player.threePointsAttempted.toFixed(2),
              freeThrowsMade: player.freeThrowsMade.toFixed(2),
              freeThrowsAttempted: player.freeThrowsAttempted.toFixed(2),
              rebounds: player.rebounds.toFixed(2),
              assists: player.assists.toFixed(2),
              steals: player.steals.toFixed(2),
              blocks: player.blocks.toFixed(2),
              turnovers: player.turnovers.toFixed(2),
              personalFouls: player.personalFouls.toFixed(2),
              cooked: player.cooked.toFixed(2),
            },
          });

          // Add the player's first games stats to the total stats
          totalStats.points += player.points;
          totalStats.twoPointsMade += player.twoPointsMade;
          totalStats.twoPointsAttempted += player.twoPointsAttempted;
          totalStats.threePointsMade += player.threePointsMade;
          totalStats.threePointsAttempted += player.threePointsAttempted;
          totalStats.freeThrowsMade += player.freeThrowsMade;
          totalStats.freeThrowsAttempted += player.freeThrowsAttempted;
          totalStats.rebounds += player.rebounds;
          totalStats.assists += player.assists;
          totalStats.steals += player.steals;
          totalStats.blocks += player.blocks;
          totalStats.turnovers += player.turnovers;
          totalStats.personalFouls += player.personalFouls;
          totalStats.cooked += player.cooked;
        } else {
          foundPlayer.gamesPlayed += 1;

          // Update the team's and each player's total stats per game
          Object.keys(foundPlayer.totalStats).map((key) => {
            if (key === "twoPointPercentage") {
              foundPlayer.totalStats[key] =
                foundPlayer.totalStats.twoPointsAttempted !== 0
                  ? (
                      (foundPlayer.totalStats.twoPointsMade /
                        foundPlayer.totalStats.twoPointsAttempted) *
                      100
                    ).toFixed(0)
                  : "0";
            } else if (key === "threePointPercentage") {
              foundPlayer.totalStats[key] =
                foundPlayer.totalStats.threePointsAttempted !== 0
                  ? (
                      (foundPlayer.totalStats.threePointsMade /
                        foundPlayer.totalStats.threePointsAttempted) *
                      100
                    ).toFixed(0)
                  : "0";
            } else if (key === "freeThrowPercentage") {
              foundPlayer.totalStats[key] =
                foundPlayer.totalStats.freeThrowsAttempted !== 0
                  ? (
                      (foundPlayer.totalStats.freeThrowsMade /
                        foundPlayer.totalStats.freeThrowsAttempted) *
                      100
                    ).toFixed(0)
                  : "0";
            } else {
              foundPlayer.totalStats[key] += player[key];
              totalStats[key] += player[key];
            }
          });

          // Get the average of each stat based on the games played
          foundPlayer.averageStats = {
            points: (
              foundPlayer.totalStats.points / foundPlayer.gamesPlayed
            ).toFixed(2),
            twoPointsMade: (
              foundPlayer.totalStats.twoPointsMade / foundPlayer.gamesPlayed
            ).toFixed(2),
            twoPointsAttempted: (
              foundPlayer.totalStats.twoPointsAttempted /
              foundPlayer.gamesPlayed
            ).toFixed(2),
            threePointsMade: (
              foundPlayer.totalStats.threePointsMade / foundPlayer.gamesPlayed
            ).toFixed(2),
            threePointsAttempted: (
              foundPlayer.totalStats.threePointsAttempted /
              foundPlayer.gamesPlayed
            ).toFixed(2),
            freeThrowsMade: (
              foundPlayer.totalStats.freeThrowsMade / foundPlayer.gamesPlayed
            ).toFixed(2),
            freeThrowsAttempted: (
              foundPlayer.totalStats.freeThrowsAttempted /
              foundPlayer.gamesPlayed
            ).toFixed(2),
            rebounds: (
              foundPlayer.totalStats.rebounds / foundPlayer.gamesPlayed
            ).toFixed(2),
            assists: (
              foundPlayer.totalStats.assists / foundPlayer.gamesPlayed
            ).toFixed(2),
            steals: (
              foundPlayer.totalStats.steals / foundPlayer.gamesPlayed
            ).toFixed(2),
            blocks: (
              foundPlayer.totalStats.blocks / foundPlayer.gamesPlayed
            ).toFixed(2),
            turnovers: (
              foundPlayer.totalStats.turnovers / foundPlayer.gamesPlayed
            ).toFixed(2),
            personalFouls: (
              foundPlayer.totalStats.personalFouls / foundPlayer.gamesPlayed
            ).toFixed(2),
            cooked: (
              foundPlayer.totalStats.cooked / foundPlayer.gamesPlayed
            ).toFixed(2),
          };
        }
      });
    });

    // Update the team's total two point, three point and free throw percentage
    totalStats.twoPointPercentage =
      totalStats.twoPointsAttempted !== 0
        ? (
            (totalStats.twoPointsMade / totalStats.twoPointsAttempted) *
            100
          ).toFixed(0)
        : "0";

    totalStats.threePointPercentage =
      totalStats.threePointsAttempted !== 0
        ? (
            (totalStats.threePointsMade / totalStats.threePointsAttempted) *
            100
          ).toFixed(0)
        : "0";

    totalStats.freeThrowPercentage =
      totalStats.freeThrowsAttempted !== 0
        ? (
            (totalStats.freeThrowsMade / totalStats.freeThrowsAttempted) *
            100
          ).toFixed(0)
        : "0";

    // Update the team's average stats
    const averageStats = {
      points: (totalStats.points / gamesPlayed).toFixed(2),
      twoPointsMade: (totalStats.twoPointsMade / gamesPlayed).toFixed(2),
      twoPointsAttempted: (totalStats.twoPointsAttempted / gamesPlayed).toFixed(
        2
      ),
      threePointsMade: (totalStats.threePointsMade / gamesPlayed).toFixed(2),
      threePointsAttempted: (
        totalStats.threePointsAttempted / gamesPlayed
      ).toFixed(2),
      freeThrowsMade: (totalStats.freeThrowsMade / gamesPlayed).toFixed(2),
      freeThrowsAttempted: (
        totalStats.freeThrowsAttempted / gamesPlayed
      ).toFixed(2),
      rebounds: (totalStats.rebounds / gamesPlayed).toFixed(2),
      assists: (totalStats.assists / gamesPlayed).toFixed(2),
      steals: (totalStats.steals / gamesPlayed).toFixed(2),
      blocks: (totalStats.blocks / gamesPlayed).toFixed(2),
      turnovers: (totalStats.turnovers / gamesPlayed).toFixed(2),
      personalFouls: (totalStats.personalFouls / gamesPlayed).toFixed(2),
      cooked: (totalStats.cooked / gamesPlayed).toFixed(2),
    };

    return {
      players: players.sort(
        (player1, player2) => player1.number - player2.number
      ),
      teamStats: {
        gamesPlayed: gamesPlayed,
        totalStats: totalStats,
        averageStats: averageStats,
      },
    };
  }

  if (method === "GET") {
    try {
      const seasonStats = await getSeasonStats(seasonNumber);

      // Send the season stats back to the client
      res.status(200).json(seasonStats);
    } catch (error) {
      console.error(`Error retrieving season ${seasonNumber} stats: ${error}`);
      res
        .status(500)
        .send(
          `There was an error retrieving season ${seasonNumber} stats. Please try again later`
        );
    }
  } else {
    console.error(`Invalid method ${method} in stats endpoint`);
    res.status(405).send(`Method ${method} does not have an endpoint`);
  }
}
