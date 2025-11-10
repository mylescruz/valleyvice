import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const method = req?.method;

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const gamesCol = db.collection("games");
  const playersCol = db.collection("players");
  const leadersCol = db.collection("leaders");

  // Get how many total games, total wins and total losses against opponents
  const getOpponentsData = async () => {
    try {
      const opponents = await gamesCol
        .aggregate([
          { $match: { result: { $ne: null } } },
          { $project: { opponent: 1, result: 1 } },
          {
            $group: {
              _id: "$opponent",
              games: { $sum: 1 },
              wins: {
                $sum: { $cond: [{ $eq: ["$result", "W"] }, 1, 0] },
              },
              losses: {
                $sum: { $cond: [{ $eq: ["$result", "L"] }, 1, 0] },
              },
            },
          },
          { $match: { games: { $gt: 2 } } },
          {
            $project: {
              opponent: "$_id",
              games: 1,
              wins: 1,
              losses: 1,
              _id: 0,
            },
          },
          { $sort: { games: -1 } },
        ])
        .toArray();

      return opponents;
    } catch (error) {
      console.error(`Error getting opponent data from MongoDB: ${error}`);
      throw new Error(error);
    }
  };

  // Get all time total leaders
  const getTotalLeaders = async () => {
    return await leadersCol.find({ type: "total" }).toArray();
  };

  // Get all time average leaders
  const getAverageLeaders = async () => {
    return await leadersCol.find({ type: "average" }).toArray();
  };

  if (method === "GET") {
    try {
      // Get opponents data
      const opponents = await getOpponentsData();

      // Get total leaders data
      const totalLeaders = await getTotalLeaders();

      // Get average leaders data
      const averageLeaders = await getAverageLeaders();

      const analytics = {
        opponents: opponents,
        allTimeLeaders: {
          totalLeaders: totalLeaders,
          averageLeaders: averageLeaders,
        },
      };

      // Send retrieved analytics back to the client
      res.status(200).json(analytics);
    } catch (error) {
      console.error(`${method} analytics request failed: ${error}`);
      res.status(500).send("Error retrieving analytics data");
    }
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
