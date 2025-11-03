import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
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

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const seasonCol = db.collection("seasons");

  const key = "valleyvice-info.json";

  // If user tries to change the info data without having a session
  if (method !== "GET" && !session) {
    return res.status(401).send("Must login to access this information!");
  }

  // Function to get the team's info from MongoDB
  async function getInfoData() {
    try {
      // Get all seasons sorted from most to least recent
      const seasons = await seasonCol
        .find({}, { seasonNumber: 1, roster: 1 })
        .sort({ seasonNumber: -1 })
        .toArray();
      const currentSeason = seasons[0];

      // Get the details of the current season
      const seasonNumber = currentSeason.seasonNumber;
      const roster = currentSeason.roster.sort(
        (player1, player2) => player1.number - player2.number
      );

      // Get the totals for all seasons
      let seasonsPlayed = [];
      let totalGames = 0;
      let totalWins = 0;
      let totalLosses = 0;

      seasons.forEach((season) => {
        seasonsPlayed.push(season.seasonNumber);
        totalGames += season.gamesPlayed;
        totalWins += season.wins ?? 0;
        totalLosses += season.losses ?? 0;
      });

      return {
        team: "Valey Vice",
        currentSeason: seasonNumber,
        lastGameNumberPlayed: currentSeason.gamesPlayed,
        currentRoster: roster,
        seasonsPlayed: seasonsPlayed,
        totalGames: totalGames,
        totalWins: totalWins,
        totalLosses: totalLosses,
      };
    } catch (error) {
      console.error("Error retrieving the info data from S3: ", error);
      return null;
    }
  }

  if (method === "GET") {
    try {
      const info = await getInfoData();

      // Send the team's info back to the client
      res.status(200).json(info);
    } catch (error) {
      console.error(`${method} info request failed: ${error}`);
      res.status(500).send("Error retrieving info data");
    }
  } else if (method === "PUT") {
    try {
      // Get the updated info from the request
      const updatedInfo = req?.body;

      const info = await getInfoData();

      // Remove subs from the current players
      const currentPlayers = updatedInfo.players.filter(
        (player) => player.id !== "vvSubs"
      );

      // Update the current info with the new info
      const newInfo = {
        ...info,
        currentSeason: updatedInfo.seasonNumber,
        currentPlayers: currentPlayers,
        seasonsPlayed: [
          {
            id: `s${updatedInfo.seasonNumber}`,
            seasonNumber: updatedInfo.seasonNumber,
          },
          ...info.seasonsPlayed,
        ],
      };

      // Set the file parameters for the updated info file
      const newInfoParams = {
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(newInfo, null, 2),
        ContentType: "application/json",
      };

      // Save the updated info file into S3
      await S3.send(new PutObjectCommand(newInfoParams));

      // Send the new info object back to the client
      res.status(200).json(newInfo);
    } catch (error) {
      console.error(`${method} info request failed: ${error}`);
      res.status(500).send("Error updating info data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
