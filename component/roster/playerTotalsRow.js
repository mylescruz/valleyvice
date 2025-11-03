const PlayerTotalsRow = ({ season, totalCellsStyle }) => {
  return (
    <tr>
      <td className={totalCellsStyle}>{season.seasonNumber}</td>
      <td className={totalCellsStyle}>{season.gamesPlayed}</td>
      <td className={totalCellsStyle}>{season.points}</td>
      <td className={totalCellsStyle}>{season.twoPointsMade}</td>
      <td className={totalCellsStyle}>{season.twoPointsAttempted}</td>
      <td className={totalCellsStyle}>{season.twoPointPercentage}%</td>
      <td className={totalCellsStyle}>{season.threePointsMade}</td>
      <td className={totalCellsStyle}>{season.threePointsAttempted}</td>
      <td className={totalCellsStyle}>{season.threePointPercentage}%</td>
      <td className={totalCellsStyle}>{season.freeThrowsMade}</td>
      <td className={totalCellsStyle}>{season.freeThrowsAttempted}</td>
      <td className={totalCellsStyle}>{season.freeThrowPercentage}%</td>
      <td className={totalCellsStyle}>{season.rebounds}</td>
      <td className={totalCellsStyle}>{season.assists}</td>
      <td className={totalCellsStyle}>{season.steals}</td>
      <td className={totalCellsStyle}>{season.blocks}</td>
      <td className={totalCellsStyle}>{season.turnovers}</td>
      <td className={totalCellsStyle}>{season.personalFouls}</td>
      <td className={totalCellsStyle}>{season.cooked}</td>
    </tr>
  );
};

export default PlayerTotalsRow;
