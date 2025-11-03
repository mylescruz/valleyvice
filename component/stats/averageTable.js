import useSeason from "@/hooks/useSeason";
import ErrorLayout from "../layout/errorLayout";
import useSeasonStats from "@/hooks/useSeasonStats";

const AverageTable = ({ seasonNumber }) => {
  const { seasonStats, seasonStatsLoading } = useSeasonStats(seasonNumber);

  const averageCellsStyle = "w-1/16 p-1 text-center";

  if (seasonStatsLoading && !seasonStats) {
    return <></>;
  } else if (seasonStats) {
    return (
      <>
        <h1 className="text-3xl text-(--primary) text-center font-bold mt-8">
          Per Game Stats
        </h1>
        <div className="flex flex-col overflow-x-auto my-4">
          <table>
            <thead className="border-b-1 border-white">
              <tr>
                <th className={averageCellsStyle}>#</th>
                <th className={averageCellsStyle}>PLR</th>
                <th className={averageCellsStyle}>GP</th>
                <th className={averageCellsStyle}>PPG</th>
                <th className={averageCellsStyle}>2PM</th>
                <th className={averageCellsStyle}>2PA</th>
                <th className={averageCellsStyle}>3PM</th>
                <th className={averageCellsStyle}>3PA</th>
                <th className={averageCellsStyle}>FT</th>
                <th className={averageCellsStyle}>FTA</th>
                <th className={averageCellsStyle}>REB</th>
                <th className={averageCellsStyle}>AST</th>
                <th className={averageCellsStyle}>STL</th>
                <th className={averageCellsStyle}>BLK</th>
                <th className={averageCellsStyle}>TO</th>
                <th className={averageCellsStyle}>PF</th>
                <th className={averageCellsStyle}>CKD</th>
              </tr>
            </thead>
            <tbody>
              {seasonStats.players.map((player, index) => (
                <tr key={index}>
                  <td className={averageCellsStyle}>{player.number}</td>
                  <td className={averageCellsStyle}>{player.name}</td>
                  <td className={averageCellsStyle}>{player.gamesPlayed}</td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.points}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.twoPointsMade}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.twoPointsAttempted}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.threePointsMade}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.threePointsAttempted}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.freeThrowsMade}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.freeThrowsAttempted}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.rebounds}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.assists}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.steals}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.blocks}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.turnovers}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.personalFouls}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.cooked}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-1 border-white">
                <td className={averageCellsStyle}>Totals</td>
                <td className={averageCellsStyle}></td>
                <td className={averageCellsStyle}></td>
                {Object.entries(seasonStats.teamStats.averageStats).map(
                  ([key, value]) => (
                    <td key={key} className={averageCellsStyle}>
                      {value}
                    </td>
                  )
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  } else {
    return <ErrorLayout />;
  }
};

export default AverageTable;
