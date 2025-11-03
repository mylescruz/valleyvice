import PlayerTotalsRow from "./playerTotalsRow";

const PlayerTotals = ({ player }) => {
  const totalCellsStyle = "w-1/19 p-1 text-center";

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl text-(--primary) text-center font-bold">
        Season Totals
      </h1>
      <div className="flex flex-col my-4 overflow-x-auto">
        <table>
          <thead className="border-b-1 border-white">
            <tr>
              <th className={totalCellsStyle}>SEASON</th>
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
            {player.seasons.map((season, index) => (
              <PlayerTotalsRow
                key={index}
                season={season}
                totalCellsStyle={totalCellsStyle}
              />
            ))}
          </tbody>
          <tfoot className="border-t-1 border-white">
            <tr>
              <td className={totalCellsStyle}>Totals</td>
              <td className={totalCellsStyle}>
                {player.totalStats.gamesPlayed}
              </td>
              <td className={totalCellsStyle}>{player.totalStats.points}</td>
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
              <td className={totalCellsStyle}>{player.totalStats.rebounds}</td>
              <td className={totalCellsStyle}>{player.totalStats.assists}</td>
              <td className={totalCellsStyle}>{player.totalStats.steals}</td>
              <td className={totalCellsStyle}>{player.totalStats.blocks}</td>
              <td className={totalCellsStyle}>{player.totalStats.turnovers}</td>
              <td className={totalCellsStyle}>
                {player.totalStats.personalFouls}
              </td>
              <td className={totalCellsStyle}>{player.totalStats.cooked}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default PlayerTotals;
