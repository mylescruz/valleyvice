const SeasonAveragesRows = ({ season, averageCellsStyle }) => {
  const noStats = "0.00";
  return (
    <tr>
      <td className={averageCellsStyle}>{season.seasonNumber}</td>
      <td className={averageCellsStyle}>{season.gp}</td>
      <td className={averageCellsStyle}>{season.ppg}</td>
      <td className={averageCellsStyle}>{season.pm2}</td>
      <td className={averageCellsStyle}>{season.pa2}</td>
      <td className={averageCellsStyle}>{season.pm3}</td>
      <td className={averageCellsStyle}>{season.pa3}</td>
      <td className={averageCellsStyle}>{season.ftm}</td>
      <td className={averageCellsStyle}>{season.fta}</td>
      <td className={averageCellsStyle}>{season.reb}</td>
      <td className={averageCellsStyle}>{season.ast}</td>
      <td className={averageCellsStyle}>{season.stl}</td>
      <td className={averageCellsStyle}>{season.blk}</td>
      <td className={averageCellsStyle}>{season.to}</td>
      <td className={averageCellsStyle}>{season.pf}</td>
      <td className={averageCellsStyle}>{season.ckd}</td>
    </tr>
  );
};

export default SeasonAveragesRows;
