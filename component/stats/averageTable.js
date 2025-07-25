import useSeason from "@/hooks/useSeason";
import ErrorLayout from "../layout/errorLayout";

const AverageTable = ({ seasonNumber }) => {
  const { season, seasonLoading } = useSeason(seasonNumber);
  const noStats = 0;

  const teamAverages = season.playerTotalStats?.map((player) => {
    return {
      ...player,
      ppg:
        player.pm2 || player.pm3 || player.ft
          ? (player.pm2 * 2 + player.pm3 * 3 + (player.ft ? player.ft : 0)) /
            player.gp
          : noStats,
      pm2: player.pm2 ? player.pm2 / player.gp : noStats,
      pa2: player.pa2 ? player.pa2 / player.gp : noStats,
      pm3: player.pm3 ? player.pm3 / player.gp : noStats,
      pa3: player.pa3 ? player.pa3 / player.gp : noStats,
      ft: player.ft ? player.ft / player.gp : noStats,
      fta: player.fta ? player.fta / player.gp : noStats,
      reb: player.reb ? player.reb / player.gp : noStats,
      ast: player.ast ? player.ast / player.gp : noStats,
      stl: player.stl ? player.stl / player.gp : noStats,
      blk: player.blk ? player.blk / player.gp : noStats,
      to: player.to ? player.to / player.gp : noStats,
      pf: player.pf ? player.pf / player.gp : noStats,
      ckd: player.ckd ? player.ckd / player.gp : noStats,
    };
  });

  const averageTotals = teamAverages?.reduce(
    (sum, player) => {
      sum.ppg += player.ppg;
      sum.pm2 += player.pm2;
      sum.pa2 += player.pa2;
      sum.pm3 += player.pm3;
      sum.pa3 += player.pa3;
      sum.ft += player.ft;
      sum.fta += player.fta;
      sum.reb += player.reb;
      sum.ast += player.ast;
      sum.stl += player.stl;
      sum.blk += player.blk;
      sum.to += player.to;
      sum.pf += player.pf;
      sum.ckd += player.ckd;

      return sum;
    },
    {
      ppg: 0,
      pm2: 0,
      pa2: 0,
      pm3: 0,
      pa3: 0,
      ft: 0,
      fta: 0,
      reb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      to: 0,
      pf: 0,
      ckd: 0,
    }
  );

  const averageCellsStyle = "w-1/16 p-1 text-center";

  if (seasonLoading) {
    return <></>;
  } else if (season) {
    return (
      <>
        <h1 className="text-3xl text-(--primary) text-center font-bold mt-8">
          Per Game Stats
        </h1>
        <div className="flex flex-col overflow-x-auto my-4">
          <table>
            <thead className="border-b-1 border-white">
              <tr>
                <th className={averageCellsStyle}>PLR</th>
                <th className={averageCellsStyle}>GP</th>
                <th className={averageCellsStyle}>PPG</th>
                <th className={averageCellsStyle}>2PM</th>
                <th className={averageCellsStyle}>2PA</th>
                <th className={averageCellsStyle}>3PM</th>
                <th className={averageCellsStyle}>3PA</th>
                <th className={averageCellsStyle}>FT</th>
                <th className={averageCellsStyle}>FTA</th>
                <th className={averageCellsStyle}>REB</th>
                <th className={averageCellsStyle}>AST</th>
                <th className={averageCellsStyle}>STL</th>
                <th className={averageCellsStyle}>BLK</th>
                <th className={averageCellsStyle}>TO</th>
                <th className={averageCellsStyle}>PF</th>
                <th className={averageCellsStyle}>CKD</th>
              </tr>
            </thead>
            <tbody>
              {teamAverages.map((player) => (
                <tr key={player.id}>
                  <td className={averageCellsStyle}>{player.name}</td>
                  <td className={averageCellsStyle}>{player.gp}</td>
                  <td className={averageCellsStyle}>{player.ppg.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.pm2.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.pa2.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.pm3.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.pa3.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.ft.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.fta.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.reb.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.ast.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.stl.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.blk.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.to.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.pf.toFixed(2)}</td>
                  <td className={averageCellsStyle}>{player.ckd.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-1 border-white">
                <td className={averageCellsStyle}>Totals</td>
                <td className={averageCellsStyle}></td>
                <td className={averageCellsStyle}>
                  {averageTotals.ppg.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.pm2.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.pa2.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.pm3.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.pa3.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.ft.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.fta.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.reb.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.ast.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.stl.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.blk.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.to.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.pf.toFixed(2)}
                </td>
                <td className={averageCellsStyle}>
                  {averageTotals.ckd.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </>
    );
  } else {
    return <ErrorLayout />;
  }
};

export default AverageTable;
