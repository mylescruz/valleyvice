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

      finalGame.valleyViceScore = teamStats.points;
      finalGame.result =
        finalGame.valleyViceScore > finalGame.opponentScore ? "W" : "L";

      const updatedPlayers = finalGame.players.map((player) => {
        return {
          playerId: player.playerId,
          name: player.name,
          number: player.number,
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
            players: updatedPlayers,
          },
          { session },
        );
        console.log(insertGameResult);

        // Update the season with the results of the new game
        const wins = await gamesCol.find({ result: "W" }).toArray();
        const losses = await gamesCol.find({ result: "L" }).toArray();

        const numWins = wins.length;
        const numLosses = losses.length;
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

        // Update the players' stats in MongoDB
        await Promise.all(
          game.players.map(async (player) => {
            const currentPlayer = await playersCol.findOne(
              {
                playerId: player.playerId,
              },
              { session },
            );

            if (!currentPlayer) {
              throw new Error(
                `There is no player with the playerId: ${player.playerId}. Please add the player and then try to save the game again.`,
              );
            }

            const currentSeason = currentPlayer.seasons.find(
              (season) => season.seasonNumber === game.seasonNumber,
            );

            if (currentSeason) {
              const totalTwoPointsMade =
                player.twoPointsMade + currentSeason.twoPointsMade;
              const totalTwoPointAttempts =
                player.twoPointsAttempted + currentSeason.twoPointsAttempted;
              const twoPointPercentage = calculatePercentage(
                totalTwoPointsMade,
                totalTwoPointAttempts,
              );

              const totalThreePointsMade =
                player.threePointsMade + currentSeason.threePointsMade;
              const totalThreePointAttempts =
                player.threePointsAttempted +
                currentSeason.threePointsAttempted;
              const threePointPercentage = calculatePercentage(
                totalThreePointsMade,
                totalThreePointAttempts,
              );

              const totalFreeThrowsMade =
                player.freeThrowsMade + currentSeason.freeThrowsMade;
              const totalFreeThrowAttempts =
                player.freeThrowsAttempted + currentSeason.freeThrowsAttempted;
              const freeThrowPercentage = calculatePercentage(
                totalFreeThrowsMade,
                totalFreeThrowAttempts,
              );

              await playersCol.updateOne(
                {
                  playerId: player.playerId,
                  "seasons.seasonNumber": game.seasonNumber,
                },
                {
                  $inc: {
                    "seasons.$.gamesPlayed": 1,
                    "seasons.$.points": player.points,
                    "seasons.$.twoPointsMade": player.twoPointsMade,
                    "seasons.$.twoPointsAttempted": player.twoPointsAttempted,
                    "seasons.$.threePointsMade": player.threePointsMade,
                    "seasons.$.threePointsAttempted":
                      player.threePointsAttempted,
                    "seasons.$.freeThrowsMade": player.freeThrowsMade,
                    "seasons.$.freeThrowsAttempted": player.freeThrowsAttempted,
                    "seasons.$.rebounds": player.rebounds,
                    "seasons.$.assists": player.assists,
                    "seasons.$.steals": player.steals,
                    "seasons.$.blocks": player.blocks,
                    "seasons.$.turnovers": player.turnovers,
                    "seasons.$.personalFouls": player.personalFouls,
                    "seasons.$.cooked": player.cooked,
                  },
                  $set: {
                    "seasons.$.twoPointPercentage": twoPointPercentage,
                    "seasons.$.threePointPercentage": threePointPercentage,
                    "seasons.$.freeThrowPercentage": freeThrowPercentage,
                  },
                },
                { session },
              );
            } else {
              await playersCol.updateOne(
                {
                  playerId: player.playerId,
                },
                {
                  $push: {
                    seasons: {
                      seasonNumber: game.seasonNumber,
                      gamesPlayed: 1,
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
                    },
                  },
                },
                { session },
              );
            }
          }),
        );

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
