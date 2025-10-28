const SeasonTotalsRows = ({ season, totalCellsStyle }) => {
  const noStats = 0;

  return (
    <tr>
      <td className={totalCellsStyle}>{season.seasonNumber}</td>
      <td className={totalCellsStyle}>{season.gp}</td>
      <td className={totalCellsStyle}>{season.pts}</td>
      <td className={totalCellsStyle}>{season.pm2}</td>
      <td className={totalCellsStyle}>{season.pa2}</td>
      <td className={totalCellsStyle}>{season.p2avg}%</td>
      <td className={totalCellsStyle}>{season.pm3}</td>
      <td className={totalCellsStyle}>{season.pa3}</td>
      <td className={totalCellsStyle}>{season.p3avg}%</td>
      <td className={totalCellsStyle}>{season.ftm}</td>
      <td className={totalCellsStyle}>{season.fta}</td>
      <td className={totalCellsStyle}>{season.ftavg}%</td>
      <td className={totalCellsStyle}>{season.reb}</td>
      <td className={totalCellsStyle}>{season.ast}</td>
      <td className={totalCellsStyle}>{season.stl}</td>
      <td className={totalCellsStyle}>{season.blk}</td>
      <td className={totalCellsStyle}>{season.to}</td>
      <td className={totalCellsStyle}>{season.pf}</td>
      <td className={totalCellsStyle}>{season.ckd}</td>
    </tr>
  );
};

export default SeasonTotalsRows;
