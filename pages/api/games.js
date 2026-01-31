import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { updateSeasonStats } from "@/lib/updateSeasonStats";
import { setAllTimeLeaders } from "@/lib/setAllTimeLeaders";
import calculatePercentage from "@/helpers/calculatePercentage";

export default async function handler(req, res) {
  // Authorize server access using NextAuth
  const session = await getServerSession(req, res, authOptions);

  // If user tries to change the season data without having a session
  if (!session) {
    return res.status(401).send("Must login to access this information!");
  }

  const method = req?.method;

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");
  const seasonsCol = db.collection("seasons");
  const playersCol = db.collection("players");

  if (method === "POST") {
    const mongoSession = await client.startSession();

    try {
      const game = req?.body;

      // Add the new game to MongoDB
      let { teamStats, currentlyTracking, ...finalGame } = game;

      const result =
        finalGame.valleyViceScore > finalGame.opponentScore ? "W" : "L";

      const updatedPlayers = finalGame.players.map((player) => {
        return {
          playerId: player.playerId,
          name: player.name,
          number: player.number,
          points: player.points,
          twoPointsMade: player.twoPointsMade,
          twoPointsAttempted: player.twoPointsAttempted,
          twoPointPercentage: calculatePercentage(
            player.twoPointsMade,
            player.twoPointsAttempted,
          ),
          threePointsMade: player.threePointsMade,
          threePointsAttempted: player.threePointsAttempted,
          threePointPercentage: calculatePercentage(
            player.threePointsMade,
            player.threePointsAttempted,
          ),
          freeThrowsMade: player.freeThrowsMade,
          freeThrowsAttempted: player.freeThrowsAttempted,
          freeThrowPercentage: calculatePercentage(
            player.freeThrowsMade,
            player.freeThrowsAttempted,
          ),
          rebounds: player.rebounds,
          assists: player.assists,
          steals: player.steals,
          blocks: player.blocks,
          turnovers: player.turnovers,
          personalFouls: player.personalFouls,
          cooked: player.cooked,
        };
      });

      // Start a transaction to process all MongoDB statements or rollback any failures
      await mongoSession.withTransaction(async (session) => {
        const insertGameResult = await gamesCol.insertOne(
          {
            ...finalGame,
            result: result,
            players: updatedPlayers,
          },
          { session },
        );
        console.log(insertGameResult);

        // Update the season with the results of the new game
        const numWins = await gamesCol.countDocuments(
          { seasonNumber: game.seasonNumber, result: "W" },
          { session },
        );
        const numLosses = await gamesCol.countDocuments(
          { seasonNumber: game.seasonNumber, result: "L" },
          { session },
        );

        const numGames = numWins + numLosses;

        const seasonUpdateResult = await seasonsCol.updateOne(
          { seasonNumber: game.seasonNumber },
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
          .find({ seasonNumber: game.seasonNumber })
          .toArray();

        // Get the total stats of each player for the season
        const seasonStatsMap = new Map();

        currentSeasonGames.forEach((currentGame) => {
          currentGame.players.forEach((player) => {
            const playerStats = seasonStatsMap.get(player.playerId);

            if (!playerStats) {
              seasonStatsMap.set(player.playerId, {
                seasonNumber: game.seasonNumber,
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
            (season) => season.seasonNumber === game.seasonNumber,
          );

          // Update the player's current season or add the season to the player's season field
          if (!seasonExists) {
            currentPlayer.seasons.push(playerStats);
          } else {
            currentPlayer.seasons = currentPlayer.seasons.map((seasonStats) => {
              if (seasonStats.seasonNumber === game.seasonNumber) {
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
          seasonNumber: finalGame.seasonNumber,
          session,
        });

        // Update the all time leader's rankings
        await setAllTimeLeaders({ session });
      });

      // Send retrieved game back to the client
      res.status(200).json(game);
    } catch (error) {
      console.error(`${method} game request failed: ${error}`);
      res.status(500).send("Error adding new game data");
    } finally {
      await mongoSession.endSession();
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
