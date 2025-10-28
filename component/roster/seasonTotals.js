import seasonSorter from "@/helpers/seasonSorter";
import SeasonTotalsRows from "./seasonTotalsRows";

const SeasonTotals = ({ player }) => {
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
            {player.seasons.map((season, index) => (
              <SeasonTotalsRows
                key={index}
                season={season}
                totalCellsStyle={totalCellsStyle}
              />
            ))}
          </tbody>
          <tfoot className="border-t-1 border-white">
            <tr>
              <td className={totalCellsStyle}>Totals</td>
              <td className={totalCellsStyle}>{player.totalStats.gp}</td>
              <td className={totalCellsStyle}>{player.totalStats.pts}</td>
              <td className={totalCellsStyle}>{player.totalStats.pm2}</td>
              <td className={totalCellsStyle}>{player.totalStats.pa2}</td>
              <td className={totalCellsStyle}>{player.totalStats.p2avg}%</td>
              <td className={totalCellsStyle}>{player.totalStats.pm3}</td>
              <td className={totalCellsStyle}>{player.totalStats.pa3}</td>
              <td className={totalCellsStyle}>{player.totalStats.p3avg}%</td>
              <td className={totalCellsStyle}>{player.totalStats.ftm}</td>
              <td className={totalCellsStyle}>{player.totalStats.fta}</td>
              <td className={totalCellsStyle}>{player.totalStats.ftavg}%</td>
              <td className={totalCellsStyle}>{player.totalStats.reb}</td>
              <td className={totalCellsStyle}>{player.totalStats.ast}</td>
              <td className={totalCellsStyle}>{player.totalStats.stl}</td>
              <td className={totalCellsStyle}>{player.totalStats.blk}</td>
              <td className={totalCellsStyle}>{player.totalStats.to}</td>
              <td className={totalCellsStyle}>{player.totalStats.pf}</td>
              <td className={totalCellsStyle}>{player.totalStats.ckd}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SeasonTotals;
