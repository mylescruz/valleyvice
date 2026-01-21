import PlayerAveragesRow from "./playerAveragesRow";

const PlayerAverages = ({ player }) => {
  const averageCellsStyle = "w-1/16 p-1 text-center";

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl text-(--primary) text-center font-bold">
        Season Averages
      </h1>
      <div className="flex flex-col my-4 overflow-x-auto">
        <table>
          <thead className="border-b-1 border-white">
            <tr>
              <th className={averageCellsStyle}>SEASON</th>
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
            {player.seasons.map((season, index) => (
              <PlayerAveragesRow
                key={index}
                season={season.averageStats}
                averageCellsStyle={averageCellsStyle}
              />
            ))}
          </tbody>
          <tfoot className="border-t-1 border-white">
            <tr>
              <td className={averageCellsStyle}>Totals</td>
              <td className={averageCellsStyle}>
                {player.averageStats.gamesPlayed}
              </td>
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
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PlayerAverages;
