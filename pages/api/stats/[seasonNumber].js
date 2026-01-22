import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const method = req?.method;
  const seasonNumber = parseInt(req?.query?.seasonNumber);

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const seasonStatsCol = db.collection("seasonStats");

  // Function to get all the stats for given season
  async function getSeasonStats(seasonNumber) {
    try {
      // Get stats from MongoDB based on the seasonNumber
      return await seasonStatsCol.findOne({
        seasonNumber: seasonNumber,
      });
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  if (method === "GET") {
    try {
      const seasonStats = await getSeasonStats(seasonNumber);

      // Send the season stats back to the client
      res.status(200).json(seasonStats);
    } catch (error) {
      console.error(`Error retrieving season ${seasonNumber} stats: ${error}`);
      res
        .status(500)
        .send(
          `There was an error retrieving season ${seasonNumber} stats. Please try again later`,
        );
    }
  } else {
    console.error(`Invalid method ${method} in stats endpoint`);
    res.status(405).send(`Method ${method} does not have an endpoint`);
  }
}
