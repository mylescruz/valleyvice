import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const method = req?.method;
  const seasonNumber = parseInt(req?.query?.seasonNumber);

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const seasonsCol = db.collection("seasons");

  // Get the roster data from MongoDB
  async function getRosterData(seasonNumber) {
    try {
      const season = await seasonsCol.findOne({ seasonNumber: seasonNumber });

      const roster = season.roster.sort(
        (player1, player2) => player1.number - player2.number
      );

      return roster;
    } catch (error) {
      console.error("Error retrieving the roster data from MongoDB: ", error);
      return null;
    }
  }

  if (method === "GET") {
    try {
      const roster = await getRosterData(seasonNumber);

      // Send the given season's roster to the client
      res.status(200).json(roster);
    } catch (error) {
      console.error(`${method} roster request failed: ${error}`);
      res.status(500).send("Error retrieving roster data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
