import useSeason from "@/hooks/useSeason";
import { useEffect, useState } from "react";

const SeasonTotalsRows = ({ playerId, seasonNumber, totalCellsStyle }) => {
  const { season, seasonLoading } = useSeason(seasonNumber);

  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!seasonLoading && season) {
      setStats(
        season.playerTotalStats.find((player) => player.id === playerId)
      );
    }
  }, [season, seasonLoading, playerId]);

  if (seasonLoading) {
    return <></>;
  }

  return (
    <tr>
      <td className={totalCellsStyle}>{seasonNumber}</td>
      <td className={totalCellsStyle}>{stats.gp}</td>
      <td className={totalCellsStyle}>
        {stats.pm2 * 2 + stats.pm3 * 3 + stats.ft}
      </td>
      <td className={totalCellsStyle}>{stats.pm2}</td>
      <td className={totalCellsStyle}>{stats.pa2}</td>
      <td className={totalCellsStyle}>
        {stats.pa2 === 0
          ? `0%`
          : `${((stats.pm2 / stats.pa2) * 100).toFixed(0)}%`}
      </td>
      <td className={totalCellsStyle}>{stats.pm3}</td>
      <td className={totalCellsStyle}>{stats.pa3}</td>
      <td className={totalCellsStyle}>
        {stats.pa3 === 0
          ? `0%`
          : `${((stats.pm3 / stats.pa3) * 100).toFixed(0)}%`}
      </td>
      <td className={totalCellsStyle}>{stats.ft}</td>
      <td className={totalCellsStyle}>{stats.fta}</td>
      <td className={totalCellsStyle}>
        {stats.fta === 0
          ? `0%`
          : `${((stats.ft / stats.fta) * 100).toFixed(0)}%`}
      </td>
      <td className={totalCellsStyle}>{stats.reb}</td>
      <td className={totalCellsStyle}>{stats.ast}</td>
      <td className={totalCellsStyle}>{stats.stl}</td>
      <td className={totalCellsStyle}>{stats.blk}</td>
      <td className={totalCellsStyle}>{stats.to}</td>
      <td className={totalCellsStyle}>{stats.pf}</td>
      <td className={totalCellsStyle}>{stats.ckd}</td>
    </tr>
  );
};

export default SeasonTotalsRows;
