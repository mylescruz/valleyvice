import useSeason from "@/hooks/useSeason";
import LoadingIndicator from "../layout/loadingIndicator";

const AverageTable = ({ seasonNumber }) => {
  const { season, seasonLoading } = useSeason(seasonNumber);

  const teamAverages = season.playerTotalStats?.map((player) => {
    return {
      ...player,
      ppg: (player.pm2 * 2 + player.pm3 * 3 + player.ft) / player.gp,
      pm2: player.pm2 / player.gp,
      pa2: player.pa2 / player.gp,
      pm3: player.pm3 / player.gp,
      pa3: player.pa3 / player.gp,
      ft: player.ft / player.gp,
      fta: player.fta / player.gp,
      reb: player.reb / player.gp,
      ast: player.ast / player.gp,
      stl: player.stl / player.gp,
      blk: player.blk / player.gp,
      to: player.to / player.gp,
      pf: player.pf / player.gp,
      ckd: player.ckd / player.gp,
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

  const averageCellsStyle = "w-1/15 p-1 text-center";

  if (seasonLoading) {
    return <LoadingIndicator />;
  } else {
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
                <th className={averageCellsStyle}>PTS</th>
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
  }
};

export default AverageTable;
