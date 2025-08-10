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
  const seasonNum = req.query.seasonNum;
  const seasonId = `s${seasonNum}`;

  const key = "roster/roster.json";

  // If user tries to change the roster data without having a session
  if (method !== "GET" && !session) {
    return res.status(401).send("Must login to access this information!");
  }

  // Function to get the roster data from Amazon S3
  async function getRosterData() {
    const rosterParams = {
      Bucket: BUCKET,
      Key: key,
    };

    try {
      const rosterData = await S3.send(new GetObjectCommand(rosterParams));
      return await streamToJSON(rosterData.Body);
    } catch (error) {
      console.error("Error retrieving the roster data from S3: ", error);
      return null;
    }
  }

  if (method === "GET") {
    try {
      const roster = await getRosterData();

      // Get the roster for the selected season
      res.status(200).json(roster[seasonId]);
    } catch (error) {
      console.error(`${method} roster request failed: ${error}`);
      res.status(500).send("Error retrieving roster data");
    }
  } else if (method === "POST") {
    try {
      const seasonInfo = req?.body;

      const roster = await getRosterData();

      // Define the new season
      const seasonId = `s${seasonInfo.seasonNumber}`;

      // Add new season roster to the current roster
      const updatedRoster = { ...roster, [seasonId]: seasonInfo.players };

      // Set the file parameters for the updated roster file
      const rosterParams = {
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(updatedRoster, null, 2),
        ContentType: "application/json",
      };

      // Save the updated roster file into S3
      await S3.send(new PutObjectCommand(rosterParams));

      // Send the updated roster object back to the client
      res.status(200).json(updatedRoster);
    } catch (error) {
      console.error(`${method} roster request failed: ${error}`);
      res.status(500).send("Error adding new roster");
    }
  } else if (method === "PUT") {
    try {
      const updatedRoster = req?.body;

      // Update the roster for the selected season
      const roster = await getRosterData();

      roster[seasonId] = updatedRoster;

      // Save the updated roster into the roster file
      const rosterParams = {
        Bucket: BUCKET,
        Key: key,
        Body: JSON.stringify(roster, null, 2),
        ContentType: "application/json",
      };

      await S3.send(new PutObjectCommand(rosterParams));

      res.status(200).json(updatedRoster);
    } catch (error) {
      console.error(`${method} roster request failed: ${error}`);
      res.status(500).send("Error updating roster data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
