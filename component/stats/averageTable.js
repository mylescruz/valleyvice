import ErrorLayout from "../layout/errorLayout";
import useSeasonStats from "@/hooks/useSeasonStats";

const AverageTable = ({ seasonNumber }) => {
  const { seasonStats, seasonStatsLoading } = useSeasonStats(seasonNumber);

  const averageCellsStyle = "w-1/17 p-1 text-center";

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
                <th className={averageCellsStyle}>FTM</th>
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
                    {player.averageStats.points.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.twoPointsMade.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.twoPointsAttempted.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.threePointsMade.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.threePointsAttempted.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.freeThrowsMade.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.freeThrowsAttempted.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.rebounds.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.assists.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.steals.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.blocks.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.turnovers.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.personalFouls.toFixed(2)}
                  </td>
                  <td className={averageCellsStyle}>
                    {player.averageStats.cooked.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-1 border-white">
                <td className={averageCellsStyle}>Totals</td>
                <td className={averageCellsStyle}></td>
                <td className={averageCellsStyle}>
                  {seasonStats.teamStats.gamesPlayed}
                </td>
                {Object.entries(seasonStats.teamStats.averageStats).map(
                  ([key, value]) => (
                    <td key={key} className={averageCellsStyle}>
                      {value.toFixed(2)}
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
