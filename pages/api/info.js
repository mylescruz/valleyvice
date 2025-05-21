import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

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

  const key = "valleyvice-info.json";

  // Function to get the info data from Amazon S3
  async function getInfoData() {
    const infoParams = {
      Bucket: BUCKET,
      Key: key,
    };

    try {
      const infoData = await S3.send(new GetObjectCommand(infoParams));
      return await streamToJSON(infoData.Body);
    } catch (error) {
      console.error("Error retrieving the info data from S3: ", error);
      return null;
    }
  }

  if (method === "GET") {
    try {
      const info = await getInfoData();

      res.status(200).json(info);
    } catch (error) {
      console.error(`${method} info request failed: ${error}`);
      res.status(500).send("Error retrieving info data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
