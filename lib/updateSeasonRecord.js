import clientPromise from "./mongodb";

export async function updateSeasonRecord({ seasonNumber, session }) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const seasonsCol = db.collection("seasons");

  // Update the season with the results of the new game
  const numWins = await gamesCol.countDocuments(
    { seasonNumber, result: "W" },
    { session },
  );
  const numLosses = await gamesCol.countDocuments(
    { seasonNumber, result: "L" },
    { session },
  );

  await seasonsCol.updateOne(
    { seasonNumber },
    {
      $set: {
        gamesPlayed: numWins + numLosses,
        wins: numWins,
        losses: numLosses,
      },
    },
    { session },
  );
}
