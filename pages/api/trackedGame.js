import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

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
  const method = req.method;

  const savedTrackedGameKey = "tracker/savedTrackedGame.json";

  // Function to get the tracked game data from Amazon S3
  async function getTrackedGameData() {
    const trackedGameParams = {
      Bucket: BUCKET,
      Key: savedTrackedGameKey,
    };

    try {
      const trackedGameData = await S3.send(
        new GetObjectCommand(trackedGameParams)
      );
      return await streamToJSON(trackedGameData.Body);
    } catch (error) {
      // If there is no saved tracked game, get the new tracked game
      if (error.name === "NoSuchKey") {
        return null;
      } else {
        console.error(
          "Error retrieving the tracked game data from S3: ",
          error
        );
        return null;
      }
    }
  }

  if (method === "GET") {
    try {
      const trackedGame = await getTrackedGameData();

      res.status(200).json(trackedGame);
    } catch (error) {
      console.error(`${method} tracked game request failed: ${error}`);
      res.status(500).send("Error retrieving tracked game data");
    }
  } else if (method === "POST") {
    try {
      const trackedGame = req?.body;

      // Save the tracked game into the saved tracked game file
      const savedTrackedGameParams = {
        Bucket: BUCKET,
        Key: savedTrackedGameKey,
        Body: JSON.stringify(trackedGame, null, 2),
        ContentType: "application/json",
      };

      await S3.send(new PutObjectCommand(savedTrackedGameParams));

      res.status(200).json(trackedGame);
    } catch (error) {
      console.error(`${method} tracked game request failed: ${error}`);
      res.status(500).send("Error retrieving tracked game data");
    }
  } else if (method === "DELETE") {
    try {
      // Delete the saved tracked game
      const savedTrackedGameParams = {
        Bucket: BUCKET,
        Key: savedTrackedGameKey,
      };

      await S3.send(new DeleteObjectCommand(savedTrackedGameParams));

      const trackedGame = await getTrackedGameData();

      res.status(200).json(trackedGame);
    } catch (error) {
      if (error.name === "NoSuchKey") {
        const trackedGame = await getTrackedGameData();

        res.status(200).json(trackedGame);
      } else {
        console.error(`${method} tracked game request failed: ${error}`);
        res.status(500).send("Error deleting tracked game");
      }
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
