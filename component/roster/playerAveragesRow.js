const PlayerAveragesRow = ({ season, averageCellsStyle }) => {
  return (
    <tr>
      <td className={averageCellsStyle}>{season.seasonNumber}</td>
      <td className={averageCellsStyle}>{season.gamesPlayed}</td>
      <td className={averageCellsStyle}>{season.points}</td>
      <td className={averageCellsStyle}>{season.twoPointsMade}</td>
      <td className={averageCellsStyle}>{season.twoPointsAttempted}</td>
      <td className={averageCellsStyle}>{season.threePointsMade}</td>
      <td className={averageCellsStyle}>{season.threePointsAttempted}</td>
      <td className={averageCellsStyle}>{season.freeThrowsMade}</td>
      <td className={averageCellsStyle}>{season.freeThrowsAttempted}</td>
      <td className={averageCellsStyle}>{season.rebounds}</td>
      <td className={averageCellsStyle}>{season.assists}</td>
      <td className={averageCellsStyle}>{season.steals}</td>
      <td className={averageCellsStyle}>{season.blocks}</td>
      <td className={averageCellsStyle}>{season.turnovers}</td>
      <td className={averageCellsStyle}>{season.personalFouls}</td>
      <td className={averageCellsStyle}>{season.cooked}</td>
    </tr>
  );
};

export default PlayerAveragesRow;
