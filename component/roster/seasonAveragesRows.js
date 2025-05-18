import useSeason from "@/hooks/useSeason";
import { useEffect, useState } from "react";

const SeasonAveragesRows = ({ playerId, seasonNumber, averageCellsStyle }) => {
  const { season, seasonLoading } = useSeason(seasonNumber);

  const [averages, setAverages] = useState({});

  useEffect(() => {
    if (!seasonLoading && season) {
      const playerTotals = season.playerTotalStats.find(
        (player) => player.id === playerId
      );

      setAverages({
        ...playerTotals,
        ppg: (
          (playerTotals.pm2 * 2 + playerTotals.pm3 * 3 + playerTotals.ft) /
          playerTotals.gp
        ).toFixed(2),
        pm2: (playerTotals.pm2 / playerTotals.gp).toFixed(2),
        pa2: (playerTotals.pa2 / playerTotals.gp).toFixed(2),
        pm3: (playerTotals.pm3 / playerTotals.gp).toFixed(2),
        pa3: (playerTotals.pa3 / playerTotals.gp).toFixed(2),
        ft: (playerTotals.ft / playerTotals.gp).toFixed(2),
        fta: (playerTotals.fta / playerTotals.gp).toFixed(2),
        reb: (playerTotals.reb / playerTotals.gp).toFixed(2),
        ast: (playerTotals.ast / playerTotals.gp).toFixed(2),
        stl: (playerTotals.stl / playerTotals.gp).toFixed(2),
        blk: (playerTotals.blk / playerTotals.gp).toFixed(2),
        to: (playerTotals.to / playerTotals.gp).toFixed(2),
        pf: (playerTotals.pf / playerTotals.gp).toFixed(2),
        ckd: (playerTotals.ckd / playerTotals.gp).toFixed(2),
      });
    }
  }, [season, seasonLoading, playerId]);

  if (seasonLoading) {
    return <></>;
  } else {
    return (
      <tr>
        <td className={averageCellsStyle}>{seasonNumber}</td>
        <td className={averageCellsStyle}>{averages.gp}</td>
        <td className={averageCellsStyle}>{averages.ppg}</td>
        <td className={averageCellsStyle}>{averages.pm2}</td>
        <td className={averageCellsStyle}>{averages.pa2}</td>
        <td className={averageCellsStyle}>{averages.pm3}</td>
        <td className={averageCellsStyle}>{averages.pa3}</td>
        <td className={averageCellsStyle}>{averages.ft}</td>
        <td className={averageCellsStyle}>{averages.fta}</td>
        <td className={averageCellsStyle}>{averages.reb}</td>
        <td className={averageCellsStyle}>{averages.ast}</td>
        <td className={averageCellsStyle}>{averages.stl}</td>
        <td className={averageCellsStyle}>{averages.blk}</td>
        <td className={averageCellsStyle}>{averages.to}</td>
        <td className={averageCellsStyle}>{averages.pf}</td>
        <td className={averageCellsStyle}>{averages.ckd}</td>
      </tr>
    );
  }
};

export default SeasonAveragesRows;
