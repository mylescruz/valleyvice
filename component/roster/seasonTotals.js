import seasonSorter from "@/helpers/seasonSorter";
import SeasonTotalsRows from "./seasonTotalsRows";

const SeasonTotals = ({ player }) => {
  const playerStats = player.totalStats;
  const totalCellsStyle = "w-1/19 p-1 text-center";

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl text-(--primary) text-center font-bold">
        Season Totals
      </h1>
      <div className="flex flex-col my-4 overflow-x-auto">
        <table>
          <thead className="border-b-1 border-white">
            <tr>
              <th className={totalCellsStyle}>SEASON</th>
              <th className={totalCellsStyle}>GP</th>
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
            {seasonSorter(player.statsPerSeason)?.map((season) => (
              <SeasonTotalsRows
                key={season.id}
                season={season}
                totalCellsStyle={totalCellsStyle}
              />
            ))}
          </tbody>
          <tfoot className="border-t-1 border-white">
            <tr>
              <td className={totalCellsStyle}>Totals</td>
              <td className={totalCellsStyle}>{playerStats?.gp}</td>
              <td className={totalCellsStyle}>
                {playerStats?.pm2 * 2 +
                  playerStats?.pm3 * 3 +
                  (playerStats?.ft ? playerStats?.ft : 0)}
              </td>
              <td className={totalCellsStyle}>{playerStats?.pm2}</td>
              <td className={totalCellsStyle}>{playerStats?.pa2}</td>
              <td className={totalCellsStyle}>
                {((playerStats?.pm2 / playerStats?.pa2) * 100).toFixed(0)}%
              </td>
              <td className={totalCellsStyle}>{playerStats?.pm3}</td>
              <td className={totalCellsStyle}>{playerStats?.pa3}</td>
              <td className={totalCellsStyle}>
                {((playerStats?.pm3 / playerStats?.pa3) * 100).toFixed(0)}%
              </td>
              <td className={totalCellsStyle}>{playerStats?.ft}</td>
              <td className={totalCellsStyle}>{playerStats?.fta}</td>
              <td className={totalCellsStyle}>
                {((playerStats?.ft / playerStats?.fta) * 100).toFixed(0)}%
              </td>
              <td className={totalCellsStyle}>{playerStats?.reb}</td>
              <td className={totalCellsStyle}>{playerStats?.ast}</td>
              <td className={totalCellsStyle}>{playerStats?.stl}</td>
              <td className={totalCellsStyle}>{playerStats?.blk}</td>
              <td className={totalCellsStyle}>{playerStats?.to}</td>
              <td className={totalCellsStyle}>{playerStats?.pf}</td>
              <td className={totalCellsStyle}>{playerStats?.ckd}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SeasonTotals;
