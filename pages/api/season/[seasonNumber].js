import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";

// Configure Amazon S3
const S3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Define the S3 bucket
const BUCKET = process.env.BUCKET_NAME;

export default async function handler(req, res) {
  // Authorize server access using NextAuth
  const session = await getServerSession(req, res, authOptions);

  const method = req?.method;
  const seasonNumber = parseInt(req?.query?.seasonNumber);

  const key = `seasons/s${seasonNumber}.json`;

  // If user tries to change the season data without having a session
  if (method !== "GET" && !session) {
    return res.status(401).send("Must login to access this information!");
  }

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const seasonsCol = db.collection("seasons");

  // Function to get the season data from Amazon S3
  async function getSeasonData(seasonNumber) {
    try {
      const seasons = await seasonsCol
        .aggregate([
          { $match: { seasonNumber: seasonNumber } },
          {
            $lookup: {
              from: "games",
              pipeline: [
                { $match: { seasonNumber: seasonNumber } },
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
      const seasonInfo = req?.body;

      // Create the player's total stats array
      const playerTotalStats = seasonInfo.players.map((player) => {
        return {
          id: player.id,
          name: player.name,
          number: player.number,
          gp: 0,
          pm2: 0,
          pa2: 0,
          pm3: 0,
          pa3: 0,
          ft: 0,
          fta: 0,
          reb: 0,
          ast: 0,
          stl: 0,
          blk: 0,
          to: 0,
          pf: 0,
          ckd: 0,
        };
      });

      // Create the new season object
      const newSeason = {
        id: `s${seasonInfo.seasonNumber}`,
        seasonNumber: seasonInfo.seasonNumber,
        season: seasonInfo.season,
        year: seasonInfo.year,
        league: seasonInfo.league,
        division: seasonInfo.division,
        wins: 0,
        losses: 0,
        playerTotalStats: playerTotalStats,
        games: [],
      };

      // Set the file parameters for the new season file
      const newSeasonParams = {
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(newSeason, null, 2),
        ContentType: "application/json",
      };

      // Save the new season file into S3
      await S3.send(new PutObjectCommand(newSeasonParams));

      // Send the new season object back to the client
      res.status(200).json(newSeason);
    } catch (error) {
      console.error(`${method} season request failed: ${error}`);
      res.status(500).send("Error adding new season");
    }
  } else if (method === "PUT") {
    try {
      const updatedSeason = req?.body;

      // Save the updated season into the season file
      const seasonParams = {
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(updatedSeason, null, 2),
        ContentType: "application/json",
      };

      await S3.send(new PutObjectCommand(seasonParams));

      res.status(200).json(updatedSeason);
    } catch (error) {
      console.error(`${method} season request failed: ${error}`);
      res.status(500).send("Error updating season data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
