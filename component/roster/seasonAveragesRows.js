const SeasonAveragesRows = ({ season, averageCellsStyle }) => {
  const noStats = "0.00";

  return (
    <tr>
      <td className={averageCellsStyle}>{season.seasonNumber}</td>
      <td className={averageCellsStyle}>{season.gp}</td>
      <td className={averageCellsStyle}>
        {(
          (season.pm2 * 2 + season.pm3 * 3 + (season.ft ? season.ft : 0)) /
          season.gp
        ).toFixed(2)}
      </td>
      <td className={averageCellsStyle}>
        {season.pm2 ? (season.pm2 / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.pa2 ? (season.pa2 / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.pm3 ? (season.pm3 / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.pa3 ? (season.pa3 / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.ft ? (season.ft / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.fta ? (season.fta / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.reb ? (season.reb / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.ast ? (season.ast / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.stl ? (season.stl / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.blk ? (season.blk / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.to ? (season.to / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.pf ? (season.pf / season.gp).toFixed(2) : noStats}
      </td>
      <td className={averageCellsStyle}>
        {season.ckd ? (season.ckd / season.gp).toFixed(2) : noStats}
      </td>
    </tr>
  );
};

export default SeasonAveragesRows;
