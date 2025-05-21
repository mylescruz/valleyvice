import useSeason from "@/hooks/useSeason";
import { useEffect, useState } from "react";

const SeasonTotalsRows = ({ playerId, seasonNumber, totalCellsStyle }) => {
  const { season, seasonLoading } = useSeason(seasonNumber);

  const [stats, setStats] = useState({});

  const noStats = 0;

  useEffect(() => {
    if (!seasonLoading && season) {
      const playerTotals = season.playerTotalStats.find(
        (player) => player.id === playerId
      );

      setStats({
        ...playerTotals,
        pts:
          playerTotals.pm2 * 2 +
          playerTotals.pm3 * 3 +
          (playerTotals.ft ? playerTotals.ft : noStats),
        pm2: playerTotals.pm2 ? playerTotals.pm2 : noStats,
        pa2: playerTotals.pa2 ? playerTotals.pa2 : noStats,
        pct2:
          playerTotals.pa2 === 0
            ? `0%`
            : `${((playerTotals.pm2 / playerTotals.pa2) * 100).toFixed(0)}%`,
        pct3:
          playerTotals.pa3 === 0
            ? `0%`
            : `${((playerTotals.pm3 / playerTotals.pa3) * 100).toFixed(0)}%`,
        ft: playerTotals.ft ? playerTotals.ft : 0,
        fta: playerTotals.fta ? playerTotals.fta : 0,
        pctft:
          playerTotals.fta === 0 || !playerTotals.fta || !playerTotals.ft
            ? `0%`
            : `${((playerTotals.ft / playerTotals.fta) * 100).toFixed(0)}%`,
        pm3: playerTotals.pm3 ? playerTotals.pm3 : noStats,
        pa3: playerTotals.pa3 ? playerTotals.pa3 : noStats,
        reb: playerTotals.reb ? playerTotals.reb : noStats,
        ast: playerTotals.ast ? playerTotals.ast : noStats,
        stl: playerTotals.stl ? playerTotals.stl : noStats,
        blk: playerTotals.blk ? playerTotals.blk : noStats,
        to: playerTotals.to ? playerTotals.to : noStats,
        pf: playerTotals.pf ? playerTotals.pf : noStats,
        ckd: playerTotals.ckd ? playerTotals.ckd : noStats,
      });
    }
  }, [season, seasonLoading, playerId]);

  if (seasonLoading) {
    return <></>;
  } else {
    return (
      <tr>
        <td className={totalCellsStyle}>{seasonNumber}</td>
        <td className={totalCellsStyle}>{stats.gp}</td>
        <td className={totalCellsStyle}>{stats.pts}</td>
        <td className={totalCellsStyle}>{stats.pm2}</td>
        <td className={totalCellsStyle}>{stats.pa2}</td>
        <td className={totalCellsStyle}>{stats.pct2}</td>
        <td className={totalCellsStyle}>{stats.pm3}</td>
        <td className={totalCellsStyle}>{stats.pa3}</td>
        <td className={totalCellsStyle}>{stats.pct3}</td>
        <td className={totalCellsStyle}>{stats.ft}</td>
        <td className={totalCellsStyle}>{stats.fta}</td>
        <td className={totalCellsStyle}>{stats.pctft}</td>
        <td className={totalCellsStyle}>{stats.reb}</td>
        <td className={totalCellsStyle}>{stats.ast}</td>
        <td className={totalCellsStyle}>{stats.stl}</td>
        <td className={totalCellsStyle}>{stats.blk}</td>
        <td className={totalCellsStyle}>{stats.to}</td>
        <td className={totalCellsStyle}>{stats.pf}</td>
        <td className={totalCellsStyle}>{stats.ckd}</td>
      </tr>
    );
  }
};

export default SeasonTotalsRows;
