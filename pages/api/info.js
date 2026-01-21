import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const method = req?.method;

  // Configure MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const seasonCol = db.collection("seasons");
  const playersCol = db.collection("players");

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
        (player1, player2) => player1.number - player2.number,
      );

      // Get all former players
      const allPlayers = await playersCol
        .find({}, { projection: { playerId: 1, name: 1, number: 1, _id: 0 } })
        .toArray();

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
        allPlayers: allPlayers,
        seasonsPlayed: seasonsPlayed,
        totalGames: totalGames,
        totalWins: totalWins,
        totalLosses: totalLosses,
      };
    } catch (error) {
      console.error("Error retrieving the info data from MongoDB: ", error);
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
  } else {
    res.status(405).send(`Method ${method} not allowed`);
  }
}
