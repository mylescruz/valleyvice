import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

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
  const playerId = req.query.playerId;

  const key = `roster/${playerId}.json`;

  // If user tries to change a player's stats without having a session
  if (method !== "GET" && !session) {
    return res.status(401).send("Must login to access this information!");
  }

  // Function to get the player data from Amazon S3
  async function getPlayerData() {
    const playerParams = {
      Bucket: BUCKET,
      Key: key,
    };

    try {
      const playerData = await S3.send(new GetObjectCommand(playerParams));
      return await streamToJSON(playerData.Body);
    } catch (error) {
      console.error("Error retrieving the player data from S3: ", error);
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
