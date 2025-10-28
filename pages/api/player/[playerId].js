import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
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

// Function to convert a stream object into a JSON object
const streamToJSON = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => {
      try {
        const body = Buffer.concat(chunks).toString("utf-8");
        const data = JSON.parse(body);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

export default async function handler(req, res) {
  // Authorize server access using NextAuth
  const session = await getServerSession(req, res, authOptions);

  const method = req.method;

  // If user tries to change a player's stats without having a session
  if (method !== "GET" && !session) {
    return res.status(401).send("Must login to access this information!");
  }

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const playersCol = db.collection("players");

  const playerId = req.query.playerId;

  const key = `roster/${playerId}.json`;

  // Function to get the player data from Amazon S3
  async function getPlayerData() {
    try {
      const player = await playersCol.findOne({ playerId: playerId });

      let totalStats = {
        gp: 0,
        pts: 0,
        pm2: 0,
        pa2: 0,
        p2avg: 0,
        pm3: 0,
        pa3: 0,
        p3avg: 0,
        fgm: 0,
        fga: 0,
        fgavg: 0,
        ftm: 0,
        fta: 0,
        ftavg: 0,
        reb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        to: 0,
        pf: 0,
        ckd: 0,
      };

      const seasons = player.seasons.map((season) => {
        totalStats.gp += season.gamesPlayed;
        totalStats.pts += season.points;
        totalStats.pm2 += season.twoPointsMade;
        totalStats.pa2 += season.twoPointsAttempted;
        totalStats.pm3 += season.threePointsMade;
        totalStats.pa3 += season.threePointsAttempted;
        totalStats.fgm += season.fieldGoalsMade;
        totalStats.fga += season.fieldGoalsAttempted;
        totalStats.ftm += season.freeThrowsMade;
        totalStats.fta += season.freeThrowsAttempted;
        totalStats.reb += season.rebounds;
        totalStats.ast += season.assists;
        totalStats.stl += season.steals;
        totalStats.blk += season.blocks;
        totalStats.to += season.turnovers;
        totalStats.pf += season.personalFouls;
        totalStats.ckd += season.cooked;

        return {
          seasonNumber: season.seasonNumber,
          gp: season.gamesPlayed,
          pts: season.points,
          pm2: season.twoPointsMade,
          pa2: season.twoPointsAttempted,
          p2avg:
            season.twoPointsAttempted === 0
              ? 0
              : (
                  (season.twoPointsMade / season.twoPointsAttempted) *
                  100
                ).toFixed(0),
          pm3: season.threePointsMade,
          pa3: season.threePointsAttempted,
          p3avg:
            season.threePointsAttempted === 0
              ? 0
              : (
                  (season.threePointsMade / season.threePointsAttempted) *
                  100
                ).toFixed(0),
          fgm: season.fieldGoalsMade,
          fga: season.fieldGoalsAttempted,
          fgavg:
            season.fieldGoalsAttempted === 0
              ? 0
              : (
                  (season.fieldGoalsMade / season.fieldGoalsAttempted) *
                  100
                ).toFixed(0),
          ftm: season.freeThrowsMade,
          fta: season.freeThrowsAttempted,
          ftavg:
            season.freeThrowsAttempted === 0
              ? 0
              : (
                  (season.freeThrowsMade / season.freeThrowsAttempted) *
                  100
                ).toFixed(0),
          reb: season.rebounds,
          ast: season.assists,
          stl: season.steals,
          blk: season.blocks,
          to: season.turnovers,
          pf: season.personalFouls,
          ckd: season.cooked,
          averageStats: {
            seasonNumber: season.seasonNumber,
            gp: season.gamesPlayed,
            ppg: (season.points / season.gamesPlayed).toFixed(2),
            pm2: (season.twoPointsMade / season.gamesPlayed).toFixed(2),
            pa2: (season.twoPointsAttempted / season.gamesPlayed).toFixed(2),
            pm3: (season.threePointsMade / season.gamesPlayed).toFixed(2),
            pa3: (season.threePointsAttempted / season.gamesPlayed).toFixed(2),
            fgm: (season.fieldGoalsMade / season.gamesPlayed).toFixed(2),
            fga: (season.fieldGoalsAttempted / season.gamesPlayed).toFixed(2),
            ftm: (season.freeThrowsMade / season.gamesPlayed).toFixed(2),
            fta: (season.freeThrowsAttempted / season.gamesPlayed).toFixed(2),
            reb: (season.rebounds / season.gamesPlayed).toFixed(2),
            ast: (season.assists / season.gamesPlayed).toFixed(2),
            stl: (season.steals / season.gamesPlayed).toFixed(2),
            blk: (season.blocks / season.gamesPlayed).toFixed(2),
            to: (season.turnovers / season.gamesPlayed).toFixed(2),
            pf: (season.personalFouls / season.gamesPlayed).toFixed(2),
            ckd: (season.cooked / season.gamesPlayed).toFixed(2),
          },
        };
      });

      const averageStats = {
        gp: totalStats.gp,
        ppg: (totalStats.pts / totalStats.gp).toFixed(2),
        pm2: (totalStats.pm2 / totalStats.gp).toFixed(2),
        pa2: (totalStats.pa2 / totalStats.gp).toFixed(2),
        p2avg: ((totalStats.pm2 / totalStats.pa2) * 100).toFixed(0),
        pm3: (totalStats.pm3 / totalStats.gp).toFixed(2),
        pa3: (totalStats.pa3 / totalStats.gp).toFixed(2),
        p3avg: ((totalStats.pm3 / totalStats.pa3) * 100).toFixed(0),
        fgm: (totalStats.fgm / totalStats.gp).toFixed(2),
        fga: (totalStats.fga / totalStats.gp).toFixed(2),
        fgavg: ((totalStats.fgm / totalStats.fga) * 100).toFixed(0),
        ftm: (totalStats.ftm / totalStats.gp).toFixed(2),
        fta: (totalStats.fta / totalStats.gp).toFixed(2),
        ftavg: ((totalStats.ftm / totalStats.fta) * 100).toFixed(0),
        reb: (totalStats.reb / totalStats.gp).toFixed(2),
        ast: (totalStats.ast / totalStats.gp).toFixed(2),
        stl: (totalStats.stl / totalStats.gp).toFixed(2),
        blk: (totalStats.blk / totalStats.gp).toFixed(2),
        to: (totalStats.to / totalStats.gp).toFixed(2),
        pf: (totalStats.pf / totalStats.gp).toFixed(2),
        ckd: (totalStats.ckd / totalStats.gp).toFixed(2),
      };

      return {
        ...player,
        seasons: seasons,
        totalStats: {
          ...totalStats,
          p2avg: ((totalStats.pm2 / totalStats.pa3) * 100).toFixed(0),
          p3avg: ((totalStats.pm3 / totalStats.pa3) * 100).toFixed(0),
          fgavg: ((totalStats.fgm / totalStats.fga) * 100).toFixed(0),
          ftavg: ((totalStats.ftm / totalStats.fta) * 100).toFixed(0),
        },
        averageStats: averageStats,
      };
    } catch (error) {
      console.error("Error retrieving the player data from MongoDB: ", error);
      return null;
    }
  }

  if (method === "GET") {
    try {
      const player = await getPlayerData();

      res.status(200).json(player);
    } catch (error) {
      console.error(`${method} player request failed: ${error}`);
      res.status(500).send("Error retrieving player data");
    }
  } else if (method === "PUT") {
    try {
      const updatedPlayer = req?.body;

      // Save the updated player into the player file
      const playerParams = {
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(updatedPlayer, null, 2),
        ContentType: "application/json",
      };

      await S3.send(new PutObjectCommand(playerParams));

      res.status(200).json(updatedPlayer);
    } catch (error) {
      console.error(`${method} player request failed: ${error}`);
      res.status(500).send("Error updating player data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
