import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  // Authorize server access using NextAuth
  const session = await getServerSession(req, res, authOptions);

  const method = req?.method;
  const seasonNumber = parseInt(req?.query?.seasonNumber);

  // If user tries to change the season data without having a session
  if (method !== "GET" && !session) {
    return res.status(401).send("Must login to access this information!");
  }

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const seasonsCol = db.collection("seasons");
  const seasonStatsCol = db.collection("seasonStats");
  const playersCol = db.collection("players");

  // Function to get the season data from MongoDB
  async function getSeasonData(seasonNumber) {
    try {
      const seasons = await seasonsCol
        .aggregate([
          { $match: { seasonNumber: seasonNumber } },
          {
            $lookup: {
              from: "games",
              pipeline: [
                {
                  $match: {
                    seasonNumber: seasonNumber,
                    currentlyTracking: { $exists: false },
                  },
                },
                {
                  $project: { players: 0, playByPlay: 0, _id: 0 },
                },
                {
                  $sort: { gameNumber: 1 },
                },
              ],
              as: "games",
            },
          },
          {
            $project: {
              _id: 0,
              seasonNumber: 1,
              season: 1,
              year: 1,
              division: 1,
              league: 1,
              gamesPlayed: {
                $size: "$games",
              },
              wins: 1,
              losses: 1,
              games: 1,
            },
          },
        ])
        .toArray();

      if (!seasons.length) {
        throw new Error("Error retrieving the season data from MongoDB");
      } else {
        return seasons[0];
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async function checkExistingPlayer(player) {
    await playersCol.updateOne(
      { playerId: player.playerId },
      {
        $setOnInsert: {
          ...player,
          seasons: [],
        },
      },
      { upsert: true },
    );
  }

  if (method === "GET") {
    try {
      const season = await getSeasonData(seasonNumber);

      res.status(200).json(season);
    } catch (error) {
      console.error(`${method} season request failed: ${error}`);
      res.status(500).send(`$Error retrieving season ${seasonNumber}`);
    }
  } else if (method === "POST") {
    try {
      const newSeason = req?.body;

      // Create the player array to track individual stats
      const players = newSeason.players.map((player) => {
        return {
          playerId: player.playerId,
          name: player.name,
          number: player.number,
          height: player.height,
          position: player.position,
          imageSrc: player.imageSrc,
          imageAlt: `${player.name} Roster Picture`,
        };
      });

      // Enter a new player into the database if they don't already exist
      for (const player of players) {
        await checkExistingPlayer(player);
      }

      // Create the new season object
      const season = {
        seasonNumber: newSeason.seasonNumber,
        season: newSeason.season,
        year: newSeason.year,
        league: newSeason.league,
        division: newSeason.division,
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        roster: players,
      };

      // Add the new season to MongoDB
      const postSeasonResult = await seasonsCol.insertOne(season);
      console.log(postSeasonResult);

      // Add the new season stats object for the new season
      const postSeasonStatsResult = await seasonStatsCol.insertOne({
        seasonNumber: newSeason.seasonNumber,
        players: [],
        teamStats: [],
      });
      console.log(postSeasonStatsResult);

      // Send the new season object back to the client
      res.status(200).json(newSeason);
    } catch (error) {
      console.error(`${method} season request failed: ${error}`);
      res.status(500).send("Error adding new season");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
