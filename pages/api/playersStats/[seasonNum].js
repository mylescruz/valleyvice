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
  const seasonNum = parseInt(req.query.seasonNum);
  const seasonId = `s${seasonNum}`;

  // Function to get the player's stats data from Amazon S3
  async function getPlayerStatsData(playerId) {
    const playerKey = `roster/${playerId}.json`;

    const playerParams = {
      Bucket: BUCKET,
      Key: playerKey,
    };

    try {
      const playerData = await S3.send(new GetObjectCommand(playerParams));
      return await streamToJSON(playerData.Body);
    } catch (error) {
      console.error(
        "Error retrieving the player's stats data from S3: ",
        error
      );
      return null;
    }
  }

  if (method === "PUT") {
    try {
      const playersStats = req?.body;

      // Map through each player to update their stats
      playersStats.forEach(async (playerStats) => {
        const player = await getPlayerStatsData(playerStats.id);

        // Add the current season to the seasons played for the player
        const currentSeason = player.seasonsPlayed.find(
          (season) => season.id === seasonId
        );

        if (!currentSeason) {
          player.seasonsPlayed.push({ id: seasonId, seasonNumber: seasonNum });
          player.statsPerSeason.push({
            id: seasonId,
            seasonNumber: seasonNum,
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
          });
        }

        // Update the player's total stats
        for (let key in player.totalStats) {
          if (key === "gp") {
            player.totalStats[key] += 1;
          } else {
            player.totalStats[key] += playerStats[key];
          }
        }

        // Update the player's stats for the season given
        const seasonIndex = player.statsPerSeason.findIndex(
          (season) => season.id === seasonId
        );

        const dontUpdateFields = ["id", "seasonNumber"];
        for (let key in player.statsPerSeason[seasonIndex]) {
          if (!dontUpdateFields.includes(key)) {
            if (key === "gp") {
              player.statsPerSeason[seasonIndex][key] += 1;
            } else {
              player.statsPerSeason[seasonIndex][key] += playerStats[key];
            }
          }
        }

        // Place the updated player back into S3
        const playerKey = `roster/${player.id}.json`;

        const playerParams = {
          Bucket: BUCKET,
          Key: playerKey,
          Body: JSON.stringify(player, null, 2),
          ContentType: "application/json",
        };

        await S3.send(new PutObjectCommand(playerParams));
      });

      res.status(200).send(`Updated all players`);
    } catch (error) {
      console.error(`${method} playersStats request failed: ${error}`);
      res.status(500).send("Error updating roster data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
