import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "./auth/[...nextauth]";
import { updateSeasonStats } from "@/lib/updateSeasonStats";

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
    try {
      const game = req?.body;

      // Add the new game to MongoDB
      let { teamStats, currentlyTracking, ...finalGame } = game;

      finalGame.valleyViceScore = teamStats.points;
      finalGame.result =
        finalGame.valleyViceScore > finalGame.opponentScore ? "W" : "L";

      const updatedPlayers = finalGame.players.map((player) => {
        const twoPointPercentage =
          player.twoPointsAttempted !== 0
            ? Math.round(
                (player.twoPointsMade / player.twoPointsAttempted) * 100
              )
            : 0;
        const threePointPercentage =
          player.threePointsAttempted !== 0
            ? Math.round(
                (player.threePointsMade / player.threePointsAttempted) * 100
              )
            : 0;
        const freeThrowPercentage =
          player.freeThrowsAttempted !== 0
            ? Math.round(
                (player.freeThrowsMade / player.freeThrowsAttempted) * 100
              )
            : 0;

        return {
          playerId: player.playerId,
          name: player.name,
          number: player.number,
          points: player.points,
          twoPointsMade: player.twoPointsMade,
          twoPointsAttempted: player.twoPointsAttempted,
          twoPointPercentage: twoPointPercentage,
          threePointsMade: player.threePointsMade,
          threePointsAttempted: player.threePointsAttempted,
          threePointPercentage: threePointPercentage,
          freeThrowsMade: player.freeThrowsMade,
          freeThrowsAttempted: player.freeThrowsAttempted,
          freeThrowPercentage: freeThrowPercentage,
          rebounds: player.rebounds,
          assists: player.assists,
          steals: player.steals,
          blocks: player.blocks,
          turnovers: player.turnovers,
          personalFouls: player.personalFouls,
          cooked: player.cooked,
        };
      });

      const insertGameResult = await gamesCol.insertOne({
        ...finalGame,
        players: updatedPlayers,
      });
      console.log(insertGameResult);

      // Update the season with the results of the new game
      let updateStatement = {
        $inc: {
          gamesPlayed: 1,
        },
      };

      if (finalGame.result === "W") {
        updateStatement.$inc.wins = 1;
      } else if (finalGame.result === "L") {
        updateStatement.$inc.losses = 1;
      }

      const seasonUpdateResult = await seasonsCol.updateOne(
        { seasonNumber: game.seasonNumber },
        updateStatement
      );
      console.log(seasonUpdateResult);

      // Update the players' stats in MongoDB
      await Promise.all(
        game.players.map(async (player) => {
          const currentPlayer = await playersCol.findOne({
            playerId: player.playerId,
          });

          const currentSeason = currentPlayer.seasons.find(
            (season) => season.seasonNumber === game.seasonNumber
          );

          if (currentSeason) {
            const totalTwoPointAttempts =
              player.twoPointsAttempted + currentSeason.twoPointsAttempted;
            const twoPointPercentage =
              totalTwoPointAttempts !== 0
                ? Math.round(
                    ((currentSeason.twoPointsMade + player.twoPointsMade) /
                      totalTwoPointAttempts) *
                      100
                  )
                : "0";

            const totalThreePointAttempts =
              player.threePointsAttempted + currentSeason.threePointsAttempted;
            const threePointPercentage =
              totalThreePointAttempts !== 0
                ? Math.round(
                    ((currentSeason.threePointsMade + player.threePointsMade) /
                      totalThreePointAttempts) *
                      100
                  )
                : "0";

            const totalFreeThrowAttempts =
              player.freeThrowsAttempted + currentSeason.freeThrowsAttempted;
            const freeThrowPercentage =
              totalFreeThrowAttempts !== 0
                ? Math.round(
                    ((currentSeason.freeThrowsMade + player.freeThrowsMade) /
                      totalFreeThrowAttempts) *
                      100
                  )
                : "0";

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
                  "seasons.$.threePointsAttempted": player.threePointsAttempted,
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
              }
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
                    twoPointPercentage:
                      player.twoPointsAttempted !== 0
                        ? Math.round(
                            (player.twoPointsMade / player.twoPointsAttempted) *
                              100
                          )
                        : 0,
                    threePointsMade: player.threePointsMade,
                    threePointsAttempted: player.threePointsAttempted,
                    threePointPercentage:
                      player.threePointsAttempted !== 0
                        ? Math.round(
                            (player.threePointsMade /
                              player.threePointsAttempted) *
                              100
                          )
                        : 0,
                    freeThrowsMade: player.freeThrowsMade,
                    freeThrowsAttempted: player.freeThrowsAttempted,
                    freeThrowPercentage:
                      player.freeThrowsAttempted !== 0
                        ? Math.round(
                            (player.freeThrowsMade /
                              player.freeThrowsAttempted) *
                              100
                          )
                        : 0,
                    rebounds: player.rebounds,
                    assists: player.assists,
                    steals: player.steals,
                    blocks: player.blocks,
                    turnovers: player.turnovers,
                    personalFouls: player.personalFouls,
                    cooked: player.cooked,
                  },
                },
              }
            );
          }
        })
      );

      // Update the player's stats for the given season
      await updateSeasonStats(finalGame.seasonNumber);

      // Send retrieved game back to the client
      res.status(200).json(game);
    } catch (error) {
      console.error(`${method} game request failed: ${error}`);
      res.status(500).send("Error adding new game data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
