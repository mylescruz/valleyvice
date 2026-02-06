import calculatePercentage from "@/helpers/calculatePercentage";
import clientPromise from "@/lib/mongodb";
import { setAllTimeLeaders } from "@/lib/setAllTimeLeaders";
import { updateSeasonStats } from "@/lib/updateSeasonStats";

// Legend to update the playByPlay
const statsLegend = {
  twoPointsMade: "made a two point shot",
  twoPointsAttempted: "missed a two point shot",
  threePointsMade: "made a three point shot",
  threePointsAttempted: "missed a three point shot",
  freeThrowsMade: "made a free throw",
  freeThrowsAttempted: "missed a free throw",
  rebounds: "got a rebound",
  assists: "assisted",
  steals: "stole the ball",
  blocks: "blocked a shot",
  turnovers: "turned the ball over",
  personalFouls: "committed a foul",
  cooked: "got cooked!",
};

export default async function handler(req, res) {
  const method = req?.method;
  const seasonNumber = parseInt(req?.query?.seasonNumber);
  const gameNumber = parseInt(req?.query?.gameNumber);

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");
  const seasonsCol = db.collection("seasons");
  const playersCol = db.collection("players");

  // Get game data from MongoDB
  async function getGame(seasonNumber, gameNumber) {
    try {
      const game = await gamesCol.findOne({
        seasonNumber: seasonNumber,
        gameNumber: gameNumber,
      });

      // Track the team's total stats
      let teamStats = {
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

      // Map through each player to get their shot making percentages
      game.players.forEach((player) => {
        // Add each player's stats to the team's total stats
        Object.keys(teamStats).map((key) => {
          teamStats[key] += player[key];
        });
      });

      let allPlays = null;
      // Format the play-by-play with full stat phrases
      if (game.playByPlay) {
        const quarters =
          Object.entries(game.playByPlay).length === 1
            ? game.playByPlay.allQuarters
            : Object.values(game.playByPlay).map((value) => value);

        if (quarters.length === 4) {
          allPlays = quarters.map((quarter) => {
            const playsInQuarter = quarter.map((play) => {
              return `${play.playerName} ${statsLegend[play.stat]}`;
            });

            return playsInQuarter;
          });
        } else {
          allPlays = quarters.map((play) => {
            return `${play.playerName} ${statsLegend[play.stat]}`;
          });
        }
      }

      return {
        ...game,
        teamStats: {
          ...teamStats,
          twoPointPercentage: calculatePercentage(
            teamStats.twoPointsMade,
            teamStats.twoPointsAttempted,
          ),
          threePointPercentage: calculatePercentage(
            teamStats.threePointsMade,
            teamStats.threePointsAttempted,
          ),
          freeThrowPercentage: calculatePercentage(
            teamStats.freeThrowsMade,
            teamStats.freeThrowsAttempted,
          ),
        },
        players: game.players.sort(
          (player1, player2) => player1.number - player2.number,
        ),
        playByPlay: allPlays,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  if (method === "GET") {
    try {
      // Get game data based on the season and game number
      const game = await getGame(seasonNumber, gameNumber);

      // Send retrieved game back to the client
      res.status(200).json(game);
    } catch (error) {
      console.error(`${method} game request failed: ${error}`);
      res.status(500).send("Error getting game data");
    }
  } else if (method === "PUT") {
    const mongoSession = await client.startSession();

    try {
      const { _id, teamStats, ...updatedGame } = req.body;

      updatedGame.result =
        updatedGame.valleyViceScore > updatedGame.opponentScore ? "W" : "L";

      await mongoSession.withTransaction(async (session) => {
        const updateResult = await gamesCol.updateOne(
          {
            seasonNumber: updatedGame.seasonNumber,
            gameNumber: updatedGame.gameNumber,
          },
          {
            $set: {
              date: updatedGame.date,
              location: updatedGame.location,
              opponent: updatedGame.opponent,
              opponentScore: updatedGame.opponentScore,
              vallyeViceScore: updatedGame.vallyeViceScore,
              result: updatedGame.result,
              players: updatedGame.players,
            },
          },
          { session },
        );
        console.log(updateResult);

        // Update the season with the results of the new game
        const numWins = await gamesCol.countDocuments(
          { seasonNumber: updatedGame.seasonNumber, result: "W" },
          { session },
        );
        const numLosses = await gamesCol.countDocuments(
          { seasonNumber: updatedGame.seasonNumber, result: "L" },
          { session },
        );

        const numGames = numWins + numLosses;

        const seasonUpdateResult = await seasonsCol.updateOne(
          { seasonNumber: updatedGame.seasonNumber },
          {
            $set: {
              gamesPlayed: numGames,
              wins: numWins,
              losses: numLosses,
            },
          },
          { session },
        );
        console.log(seasonUpdateResult);

        const currentSeasonGames = await gamesCol
          .find({ seasonNumber: updatedGame.seasonNumber }, { session })
          .toArray();

        // Get the total stats of each player for the season
        const seasonStatsMap = new Map();

        currentSeasonGames.forEach((currentGame) => {
          currentGame.players.forEach((player) => {
            const playerStats = seasonStatsMap.get(player.playerId);

            if (!playerStats) {
              seasonStatsMap.set(player.playerId, {
                seasonNumber: updatedGame.seasonNumber,
                gamesPlayed: 1,
                points: player.points,
                twoPointsMade: player.twoPointsMade,
                twoPointsAttempted: player.twoPointsAttempted,
                threePointsMade: player.threePointsMade,
                threePointsAttempted: player.threePointsAttempted,
                freeThrowsMade: player.freeThrowsMade,
                freeThrowsAttempted: player.freeThrowsAttempted,
                rebounds: player.rebounds,
                assists: player.assists,
                steals: player.steals,
                blocks: player.blocks,
                turnovers: player.turnovers,
                personalFouls: player.personalFouls,
                cooked: player.cooked,
              });
            } else {
              playerStats.gamesPlayed += 1;
              playerStats.points += player.points;
              playerStats.twoPointsMade += player.twoPointsMade;
              playerStats.twoPointsAttempted += player.twoPointsAttempted;
              playerStats.threePointsMade += player.threePointsMade;
              playerStats.threePointsAttempted += player.threePointsAttempted;
              playerStats.freeThrowsMade += player.freeThrowsMade;
              playerStats.freeThrowsAttempted += player.freeThrowsAttempted;
              playerStats.rebounds += player.rebounds;
              playerStats.assists += player.assists;
              playerStats.steals += player.steals;
              playerStats.blocks += player.blocks;
              playerStats.turnovers += player.turnovers;
              playerStats.personalFouls += player.personalFouls;
              playerStats.cooked += player.cooked;
            }
          });
        });

        // Update each player's total stats
        for (const [playerId, playerStats] of seasonStatsMap.entries()) {
          // Get the percentages for each shot
          playerStats.twoPointPercentage = calculatePercentage(
            playerStats.twoPointsMade,
            playerStats.twoPointsAttempted,
          );
          playerStats.threePointPercentage = calculatePercentage(
            playerStats.threePointsMade,
            playerStats.threePointsAttempted,
          );
          playerStats.freeThrowPercentage = calculatePercentage(
            playerStats.freeThrowsMade,
            playerStats.freeThrowsAttempted,
          );

          const currentPlayer = await playersCol.findOne(
            { playerId: playerId },
            { session },
          );

          if (!currentPlayer) {
            throw new Error(
              `There is no player with the playerId: ${playerId}. Please add the player and then try to save the game again.`,
            );
          }

          const seasonExists = currentPlayer.seasons.some(
            (season) => season.seasonNumber === updatedGame.seasonNumber,
          );

          // Update the player's current season or add the season to the player's season field
          if (!seasonExists) {
            currentPlayer.seasons.push(playerStats);
          } else {
            currentPlayer.seasons = currentPlayer.seasons.map((seasonStats) => {
              if (seasonStats.seasonNumber === updatedGame.seasonNumber) {
                return playerStats;
              }

              return seasonStats;
            });
          }

          const updatePlayerResults = await playersCol.updateOne(
            { playerId: playerId },
            {
              $set: {
                seasons: currentPlayer.seasons,
              },
            },
            { session },
          );

          console.log(updatePlayerResults);
        }

        // Update the player's stats for the given season
        await updateSeasonStats({
          seasonNumber: updatedGame.seasonNumber,
          session,
        });

        // Update the all time leader's rankings
        await setAllTimeLeaders({ session });
      });

      // Send updated game back to the client
      res.status(200).json(updatedGame);
    } catch (error) {
      console.error(`${method} game request failed: ${error}`);
      res.status(500).send("Error getting game data");
    } finally {
      await mongoSession.endSession();
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
