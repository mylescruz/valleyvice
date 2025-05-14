const StatsTable = ({ playerStats, teamStats }) => {
  const playerCellsStyle = "w-1/18 p-1 text-center";
  return (
    <table>
      <thead className="border-b-1 border-white">
        <tr>
          <th className={playerCellsStyle}>PLR</th>
          <th className={playerCellsStyle}>PTS</th>
          <th className={playerCellsStyle}>2PM</th>
          <th className={playerCellsStyle}>2PA</th>
          <th className={playerCellsStyle}>2P%</th>
          <th className={playerCellsStyle}>3PM</th>
          <th className={playerCellsStyle}>3PA</th>
          <th className={playerCellsStyle}>3P%</th>
          <th className={playerCellsStyle}>FT</th>
          <th className={playerCellsStyle}>FTA</th>
          <th className={playerCellsStyle}>FT%</th>
          <th className={playerCellsStyle}>REB</th>
          <th className={playerCellsStyle}>AST</th>
          <th className={playerCellsStyle}>STL</th>
          <th className={playerCellsStyle}>BLK</th>
          <th className={playerCellsStyle}>TO</th>
          <th className={playerCellsStyle}>PF</th>
          <th className={playerCellsStyle}>CKD</th>
        </tr>
      </thead>
      <tbody>
        {playerStats?.map((player) => (
          <tr key={player.id}>
            <td className={playerCellsStyle}>{player.name}</td>
            <td className={playerCellsStyle}>
              {player.pm2 * 2 + player.pm3 * 3 + player.ft}
            </td>
            <td className={playerCellsStyle}>{player.pm2}</td>
            <td className={playerCellsStyle}>{player.pa2}</td>
            <td className={playerCellsStyle}>
              {player.pa2 === 0
                ? `0%`
                : `${((player.pm2 / player.pa2) * 100).toFixed(0)}%`}
            </td>
            <td className={playerCellsStyle}>{player.pm3}</td>
            <td className={playerCellsStyle}>{player.pa3}</td>
            <td className={playerCellsStyle}>
              {player.pa3 === 0
                ? `0%`
                : `${((player.pm3 / player.pa3) * 100).toFixed(0)}%`}
            </td>
            <td className={playerCellsStyle}>{player.ft}</td>
            <td className={playerCellsStyle}>{player.fta}</td>
            <td className={playerCellsStyle}>
              {player.fta === 0
                ? `0%`
                : `${((player.ft / player.fta) * 100).toFixed(0)}%`}
            </td>
            <td className={playerCellsStyle}>{player.reb}</td>
            <td className={playerCellsStyle}>{player.ast}</td>
            <td className={playerCellsStyle}>{player.stl}</td>
            <td className={playerCellsStyle}>{player.blk}</td>
            <td className={playerCellsStyle}>{player.to}</td>
            <td className={playerCellsStyle}>{player.pf}</td>
            <td className={playerCellsStyle}>{player.ckd}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t-1 broder-white">
          <td className={playerCellsStyle}>Totals</td>
          <td className={playerCellsStyle}>
            {teamStats?.pm2 * 2 + teamStats?.pm3 * 3 + teamStats?.ft}
          </td>
          <td className={playerCellsStyle}>{teamStats?.pm2}</td>
          <td className={playerCellsStyle}>{teamStats?.pa2}</td>
          <td className={playerCellsStyle}>
            {teamStats?.pa2 === 0
              ? `0%`
              : `${((teamStats?.pm2 / teamStats?.pa2) * 100).toFixed(0)}%`}
          </td>
          <td className={playerCellsStyle}>{teamStats?.pm3}</td>
          <td className={playerCellsStyle}>{teamStats?.pa3}</td>
          <td className={playerCellsStyle}>
            {teamStats?.pa3 === 0
              ? `0%`
              : `${((teamStats?.pm3 / teamStats?.pa3) * 100).toFixed(0)}%`}
          </td>
          <td className={playerCellsStyle}>{teamStats?.ft}</td>
          <td className={playerCellsStyle}>{teamStats?.fta}</td>
          <td className={playerCellsStyle}>
            {teamStats?.fta === 0
              ? `0%`
              : `${((teamStats?.ft / teamStats?.fta) * 100).toFixed(0)}%`}
          </td>
          <td className={playerCellsStyle}>{teamStats?.reb}</td>
          <td className={playerCellsStyle}>{teamStats?.ast}</td>
          <td className={playerCellsStyle}>{teamStats?.stl}</td>
          <td className={playerCellsStyle}>{teamStats?.blk}</td>
          <td className={playerCellsStyle}>{teamStats?.to}</td>
          <td className={playerCellsStyle}>{teamStats?.pf}</td>
          <td className={playerCellsStyle}>{teamStats?.ckd}</td>
        </tr>
      </tfoot>
    </table>
  );
};

export default StatsTable;
