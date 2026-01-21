const PlayerAveragesRow = ({ season, averageCellsStyle }) => {
  return (
    <tr>
      <td className={averageCellsStyle}>{season.seasonNumber}</td>
      <td className={averageCellsStyle}>{season.gamesPlayed}</td>
      <td className={averageCellsStyle}>{season.points.toFixed(2)}</td>
      <td className={averageCellsStyle}>{season.twoPointsMade.toFixed(2)}</td>
      <td className={averageCellsStyle}>
        {season.twoPointsAttempted.toFixed(2)}
      </td>
      <td className={averageCellsStyle}>{season.threePointsMade.toFixed(2)}</td>
      <td className={averageCellsStyle}>
        {season.threePointsAttempted.toFixed(2)}
      </td>
      <td className={averageCellsStyle}>{season.freeThrowsMade.toFixed(2)}</td>
      <td className={averageCellsStyle}>
        {season.freeThrowsAttempted.toFixed(2)}
      </td>
      <td className={averageCellsStyle}>{season.rebounds.toFixed(2)}</td>
      <td className={averageCellsStyle}>{season.assists.toFixed(2)}</td>
      <td className={averageCellsStyle}>{season.steals.toFixed(2)}</td>
      <td className={averageCellsStyle}>{season.blocks.toFixed(2)}</td>
      <td className={averageCellsStyle}>{season.turnovers.toFixed(2)}</td>
      <td className={averageCellsStyle}>{season.personalFouls.toFixed(2)}</td>
      <td className={averageCellsStyle}>{season.cooked.toFixed(2)}</td>
    </tr>
  );
};

export default PlayerAveragesRow;
