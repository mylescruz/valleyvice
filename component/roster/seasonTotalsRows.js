const SeasonTotalsRows = ({ season, totalCellsStyle }) => {
  const noStats = 0;

  return (
    <tr>
      <td className={totalCellsStyle}>{season.seasonNumber}</td>
      <td className={totalCellsStyle}>{season.gp}</td>
      <td className={totalCellsStyle}>
        {season.pm2 * 2 + season.pm3 * 3 + (season.ft ? season.ft : noStats)}
      </td>
      <td className={totalCellsStyle}>{season.pm2 ? season.pm2 : noStats}</td>
      <td className={totalCellsStyle}>{season.pa2 ? season.pa2 : noStats}</td>
      <td className={totalCellsStyle}>
        {season.pa2 === 0
          ? `0%`
          : `${((season.pm2 / season.pa2) * 100).toFixed(0)}%`}
      </td>
      <td className={totalCellsStyle}>{season.pm3 ? season.pm3 : noStats}</td>
      <td className={totalCellsStyle}>{season.pa3 ? season.pa3 : noStats}</td>
      <td className={totalCellsStyle}>
        {season.pa3 === 0
          ? `0%`
          : `${((season.pm3 / season.pa3) * 100).toFixed(0)}%`}
      </td>
      <td className={totalCellsStyle}>{season.ft ? season.ft : 0}</td>
      <td className={totalCellsStyle}>{season.fta ? season.fta : 0}</td>
      <td className={totalCellsStyle}>
        {season.fta === 0 || !season.fta || !season.ft
          ? `0%`
          : `${((season.ft / season.fta) * 100).toFixed(0)}%`}
      </td>
      <td className={totalCellsStyle}>{season.reb ? season.reb : noStats}</td>
      <td className={totalCellsStyle}>{season.ast ? season.ast : noStats}</td>
      <td className={totalCellsStyle}>{season.stl ? season.stl : noStats}</td>
      <td className={totalCellsStyle}>{season.blk ? season.blk : noStats}</td>
      <td className={totalCellsStyle}>{season.to ? season.to : noStats}</td>
      <td className={totalCellsStyle}>{season.pf ? season.pf : noStats}</td>
      <td className={totalCellsStyle}>{season.ckd ? season.ckd : noStats}</td>
    </tr>
  );
};

export default SeasonTotalsRows;
