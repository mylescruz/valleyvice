import useSeason from "@/hooks/useSeason";
import LoadingIndicator from "../layout/loadingIndicator";

const StatsLayout = ({ seasonNum }) => {
  const { season, seasonLoading } = useSeason(seasonNum);

  const teamTotals = season.playerTotalStats?.reduce(
    (sum, player) => {
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

  const totalCellsStyle = "w-1/18 p-1 text-center";
  const perGameCellsStyle = "w-1/15 p-1 text-center";

  return (
    <div className="flex flex-col items-center">
      <div className="w-11/12 sm:w-4/5">
        {seasonLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <div className="my-2 text-center">
              <label htmlFor="season">Choose a season:</label>
              <select
                id="season"
                className="px-2 border-1 border-(--secondary) rounded-lg mx-2 py-1"
              >
                <option>{seasonNum}</option>
              </select>
            </div>

            <h1 className="text-3xl text-(--primary) text-center font-bold">
              Total Stats
            </h1>
            <div className="flex flex-col my-4 overflow-x-auto">
              <table>
                <thead className="border-b-1 border-white">
                  <tr>
                    <th className={totalCellsStyle}>PLR</th>
                    <th className={totalCellsStyle}>PTS</th>
                    <th className={totalCellsStyle}>2PM</th>
                    <th className={totalCellsStyle}>2PA</th>
                    <th className={totalCellsStyle}>2P%</th>
                    <th className={totalCellsStyle}>3PM</th>
                    <th className={totalCellsStyle}>3PA</th>
                    <th className={totalCellsStyle}>3P%</th>
                    <th className={totalCellsStyle}>FT</th>
                    <th className={totalCellsStyle}>FTA</th>
                    <th className={totalCellsStyle}>FT%</th>
                    <th className={totalCellsStyle}>REB</th>
                    <th className={totalCellsStyle}>AST</th>
                    <th className={totalCellsStyle}>STL</th>
                    <th className={totalCellsStyle}>BLK</th>
                    <th className={totalCellsStyle}>TO</th>
                    <th className={totalCellsStyle}>PF</th>
                    <th className={totalCellsStyle}>CKD</th>
                  </tr>
                </thead>
                <tbody>
                  {season.playerTotalStats.map((player) => (
                    <tr key={player.id}>
                      <td className={totalCellsStyle}>{player.name}</td>
                      <td className={totalCellsStyle}>
                        {player.pm2 * 2 + player.pm3 * 3 + player.ft}
                      </td>
                      <td className={totalCellsStyle}>{player.pm2}</td>
                      <td className={totalCellsStyle}>{player.pa2}</td>
                      <td className={totalCellsStyle}>
                        {player.pa2 === 0
                          ? `0%`
                          : `${((player.pm2 / player.pa2) * 100).toFixed(0)}%`}
                      </td>
                      <td className={totalCellsStyle}>{player.pm3}</td>
                      <td className={totalCellsStyle}>{player.pa3}</td>
                      <td className={totalCellsStyle}>
                        {player.pa3 === 0
                          ? `0%`
                          : `${((player.pm3 / player.pa3) * 100).toFixed(0)}%`}
                      </td>
                      <td className={totalCellsStyle}>{player.ft}</td>
                      <td className={totalCellsStyle}>{player.fta}</td>
                      <td className={totalCellsStyle}>
                        {player.fta === 0
                          ? `0%`
                          : `${((player.ft / player.fta) * 100).toFixed(0)}%`}
                      </td>
                      <td className={totalCellsStyle}>{player.reb}</td>
                      <td className={totalCellsStyle}>{player.ast}</td>
                      <td className={totalCellsStyle}>{player.stl}</td>
                      <td className={totalCellsStyle}>{player.blk}</td>
                      <td className={totalCellsStyle}>{player.to}</td>
                      <td className={totalCellsStyle}>{player.pf}</td>
                      <td className={totalCellsStyle}>{player.ckd}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-1 border-white">
                    <td className={totalCellsStyle}>Totals</td>
                    <td className={totalCellsStyle}>
                      {teamTotals.pm2 * 2 + teamTotals.pm3 * 3 + teamTotals.ft}
                    </td>
                    <td className={totalCellsStyle}>{teamTotals.pm2}</td>
                    <td className={totalCellsStyle}>{teamTotals.pa2}</td>
                    <td className={totalCellsStyle}>
                      {teamTotals.pa2 === 0
                        ? `0%`
                        : `${((teamTotals.pm2 / teamTotals.pa2) * 100).toFixed(0)}%`}
                    </td>
                    <td className={totalCellsStyle}>{teamTotals.pm3}</td>
                    <td className={totalCellsStyle}>{teamTotals.pa3}</td>
                    <td className={totalCellsStyle}>
                      {teamTotals.pa3 === 0
                        ? `0%`
                        : `${((teamTotals.pm3 / teamTotals.pa3) * 100).toFixed(0)}%`}
                    </td>
                    <td className={totalCellsStyle}>{teamTotals.ft}</td>
                    <td className={totalCellsStyle}>{teamTotals.fta}</td>
                    <td className={totalCellsStyle}>
                      {teamTotals.fta === 0
                        ? `0%`
                        : `${((teamTotals.ft / teamTotals.fta) * 100).toFixed(0)}%`}
                    </td>
                    <td className={totalCellsStyle}>{teamTotals.reb}</td>
                    <td className={totalCellsStyle}>{teamTotals.ast}</td>
                    <td className={totalCellsStyle}>{teamTotals.stl}</td>
                    <td className={totalCellsStyle}>{teamTotals.blk}</td>
                    <td className={totalCellsStyle}>{teamTotals.to}</td>
                    <td className={totalCellsStyle}>{teamTotals.pf}</td>
                    <td className={totalCellsStyle}>{teamTotals.ckd}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <h1 className="text-3xl text-(--primary) text-center font-bold mt-8">
              Per Game Stats
            </h1>
            <div className="flex flex-col overflow-x-auto my-4">
              <table>
                <thead className="border-b-1 border-white">
                  <tr>
                    <th className={perGameCellsStyle}>PLR</th>
                    <th className={perGameCellsStyle}>PTS</th>
                    <th className={perGameCellsStyle}>2PM</th>
                    <th className={perGameCellsStyle}>2PA</th>
                    <th className={perGameCellsStyle}>3PM</th>
                    <th className={perGameCellsStyle}>3PA</th>
                    <th className={perGameCellsStyle}>FT</th>
                    <th className={perGameCellsStyle}>FTA</th>
                    <th className={perGameCellsStyle}>REB</th>
                    <th className={perGameCellsStyle}>AST</th>
                    <th className={perGameCellsStyle}>STL</th>
                    <th className={perGameCellsStyle}>BLK</th>
                    <th className={perGameCellsStyle}>TO</th>
                    <th className={perGameCellsStyle}>PF</th>
                    <th className={perGameCellsStyle}>CKD</th>
                  </tr>
                </thead>
                <tbody>
                  {teamAverages.map((player) => (
                    <tr key={player.id}>
                      <td className={perGameCellsStyle}>{player.name}</td>
                      <td className={perGameCellsStyle}>
                        {player.ppg.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.pm2.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.pa2.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.pm3.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.pa3.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.ft.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.fta.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.reb.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.ast.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.stl.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.blk.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.to.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.pf.toFixed(2)}
                      </td>
                      <td className={perGameCellsStyle}>
                        {player.ckd.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-1 border-white">
                    <td className={perGameCellsStyle}>Totals</td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.ppg.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.pm2.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.pa2.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.pm3.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.pa3.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.ft.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.fta.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.reb.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.ast.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.stl.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.blk.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.to.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.pf.toFixed(2)}
                    </td>
                    <td className={perGameCellsStyle}>
                      {averageTotals.ckd.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatsLayout;
