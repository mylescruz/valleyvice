import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import useSeasonStats from "@/hooks/useSeasonStats";

const TotalsTable = ({ seasonNumber }) => {
  const { seasonStats, seasonStatsLoading } = useSeasonStats(seasonNumber);

  const totalCellsStyle = "w-1/20 p-1 text-center";

  if (seasonStatsLoading && !seasonStats) {
    return <LoadingIndicator />;
  } else if (seasonStats) {
    return (
      <>
        <h1 className="text-3xl text-(--primary) text-center font-bold">
          Total Stats
        </h1>
        <div className="flex flex-col my-4 overflow-x-auto">
          <table>
            <thead className="border-b-1 border-white">
              <tr>
                <th className={totalCellsStyle}>#</th>
                <th className={totalCellsStyle}>PLR</th>
                <th className={totalCellsStyle}>GP</th>
                <th className={totalCellsStyle}>PTS</th>
                <th className={totalCellsStyle}>2PM</th>
                <th className={totalCellsStyle}>2PA</th>
                <th className={totalCellsStyle}>2P%</th>
                <th className={totalCellsStyle}>3PM</th>
                <th className={totalCellsStyle}>3PA</th>
                <th className={totalCellsStyle}>3P%</th>
                <th className={totalCellsStyle}>FTM</th>
                <th className={totalCellsStyle}>FTA</th>
                <th className={totalCellsStyle}>FT%</th>
                <th className={totalCellsStyle}>REB</th>
                <th className={totalCellsStyle}>AST</th>
                <th className={totalCellsStyle}>STL</th>
                <th className={totalCellsStyle}>BLK</th>
                <th className={totalCellsStyle}>TO</th>
                <th className={totalCellsStyle}>PF</th>
                <th className={totalCellsStyle}>CKD</th>
              </tr>
            </thead>
            <tbody>
              {seasonStats.players.map((player, index) => (
                <tr key={index}>
                  <td className={totalCellsStyle}>{player.number}</td>
                  <td className={totalCellsStyle}>{player.name}</td>
                  <td className={totalCellsStyle}>{player.gamesPlayed}</td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.points}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.twoPointsMade}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.twoPointsAttempted}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.twoPointPercentage}%
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.threePointsMade}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.threePointsAttempted}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.threePointPercentage}%
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.freeThrowsMade}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.freeThrowsAttempted}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.freeThrowPercentage}%
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.rebounds}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.assists}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.steals}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.blocks}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.turnovers}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.personalFouls}
                  </td>
                  <td className={totalCellsStyle}>
                    {player.totalStats.cooked}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-1 border-white">
                <td className={totalCellsStyle}>Totals</td>
                <td className={totalCellsStyle}></td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.gamesPlayed}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.points}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.twoPointsMade}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.twoPointsAttempted}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.twoPointPercentage}%
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.threePointsMade}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.threePointsAttempted}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.threePointPercentage}%
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.freeThrowsMade}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.freeThrowsAttempted}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.freeThrowPercentage}%
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.rebounds}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.assists}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.steals}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.blocks}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.turnovers}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.personalFouls}
                </td>
                <td className={totalCellsStyle}>
                  {seasonStats.teamStats.totalStats.cooked}
                </td>
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

export default TotalsTable;
