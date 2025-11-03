const StatsTable = ({ players, teamStats }) => {
  const playerCellsStyle = "w-1/19 p-1 text-center";
  return (
    <table>
      <thead className="border-b-1 border-white">
        <tr>
          <th className={playerCellsStyle}>#</th>
          <th className={playerCellsStyle}>PLR</th>
          <th className={playerCellsStyle}>PTS</th>
          <th className={playerCellsStyle}>2PM</th>
          <th className={playerCellsStyle}>2PA</th>
          <th className={playerCellsStyle}>2P%</th>
          <th className={playerCellsStyle}>3PM</th>
          <th className={playerCellsStyle}>3PA</th>
          <th className={playerCellsStyle}>3P%</th>
          <th className={playerCellsStyle}>FTM</th>
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
        {players.map((player) => (
          <tr key={player.id}>
            <td className={playerCellsStyle}>{player.number}</td>
            <td className={playerCellsStyle}>{player.name}</td>
            <td className={playerCellsStyle}>{player.points}</td>
            <td className={playerCellsStyle}>{player.twoPointsMade}</td>
            <td className={playerCellsStyle}>{player.twoPointsAttempted}</td>
            <td className={playerCellsStyle}>
              {player.twoPointsAttempted === 0
                ? `0%`
                : `${(
                    (player.twoPointsMade / player.twoPointsAttempted) *
                    100
                  ).toFixed(0)}%`}
            </td>
            <td className={playerCellsStyle}>{player.threePointsMade}</td>
            <td className={playerCellsStyle}>{player.threePointsAttempted}</td>
            <td className={playerCellsStyle}>
              {player.threePointsAttempted === 0
                ? `0%`
                : `${(
                    (player.threePointsMade / player.threePointsAttempted) *
                    100
                  ).toFixed(0)}%`}
            </td>
            <td className={playerCellsStyle}>{player.freeThrowsMade}</td>
            <td className={playerCellsStyle}>{player.freeThrowsAttempted}</td>
            <td className={playerCellsStyle}>
              {player.freeThrowsAttempted === 0
                ? `0%`
                : `${(
                    (player.freeThrowsMade / player.freeThrowsAttempted) *
                    100
                  ).toFixed(0)}%`}
            </td>
            <td className={playerCellsStyle}>{player.rebounds}</td>
            <td className={playerCellsStyle}>{player.assists}</td>
            <td className={playerCellsStyle}>{player.steals}</td>
            <td className={playerCellsStyle}>{player.blocks}</td>
            <td className={playerCellsStyle}>{player.turnovers}</td>
            <td className={playerCellsStyle}>{player.personalFouls}</td>
            <td className={playerCellsStyle}>{player.cooked}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t-1 broder-white">
          <td className={playerCellsStyle}>Totals</td>
          <td className={playerCellsStyle}></td>
          <td className={playerCellsStyle}>{teamStats.points}</td>
          <td className={playerCellsStyle}>{teamStats.twoPointsMade}</td>
          <td className={playerCellsStyle}>{teamStats.twoPointsAttempted}</td>
          <td className={playerCellsStyle}>
            {teamStats.twoPointsAttempted === 0
              ? `0%`
              : `${(
                  (teamStats.twoPointsMade / teamStats.twoPointsAttempted) *
                  100
                ).toFixed(0)}%`}
          </td>
          <td className={playerCellsStyle}>{teamStats.threePointsMade}</td>
          <td className={playerCellsStyle}>{teamStats.threePointsAttempted}</td>
          <td className={playerCellsStyle}>
            {teamStats.threePointsAttempted === 0
              ? `0%`
              : `${(
                  (teamStats.threePointsMade / teamStats.threePointsAttempted) *
                  100
                ).toFixed(0)}%`}
          </td>
          <td className={playerCellsStyle}>{teamStats.freeThrowsMade}</td>
          <td className={playerCellsStyle}>{teamStats.freeThrowsAttempted}</td>
          <td className={playerCellsStyle}>
            {teamStats.freeThrowsAttempted === 0
              ? `0%`
              : `${(
                  (teamStats.freeThrowsMade / teamStats.freeThrowsAttempted) *
                  100
                ).toFixed(0)}%`}
          </td>
          <td className={playerCellsStyle}>{teamStats.rebounds}</td>
          <td className={playerCellsStyle}>{teamStats.assists}</td>
          <td className={playerCellsStyle}>{teamStats.steals}</td>
          <td className={playerCellsStyle}>{teamStats.blocks}</td>
          <td className={playerCellsStyle}>{teamStats.turnovers}</td>
          <td className={playerCellsStyle}>{teamStats.personalFouls}</td>
          <td className={playerCellsStyle}>{teamStats.cooked}</td>
        </tr>
      </tfoot>
    </table>
  );
};

export default StatsTable;
