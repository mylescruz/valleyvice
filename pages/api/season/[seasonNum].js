import {
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
  const seasonNum = req.query.seasonNum;

  const key = `seasons/s${seasonNum}.json`;

  // Function to get the season data from Amazon S3
  async function getSeasonData() {
    const seasonParams = {
      Bucket: BUCKET,
      Key: key,
    };

    try {
      const seasonData = await S3.send(new GetObjectCommand(seasonParams));
      return await streamToJSON(seasonData.Body);
    } catch (error) {
      console.error("Error retrieving the season data from S3: ", error);
      return null;
    }
  }

  if (method === "GET") {
    try {
      const season = await getSeasonData();

      res.status(200).json(season);
    } catch (error) {
      console.error(`${method} season request failed: ${error}`);
      res.status(500).send("Error retrieving season data");
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
