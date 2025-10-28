import seasonSorter from "@/helpers/seasonSorter";
import SeasonAveragesRows from "./seasonAveragesRows";

const SeasonAverages = ({ player }) => {
  const averageCellsStyle = "w-1/16 p-1 text-center";

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl text-(--primary) text-center font-bold">
        Season Averages
      </h1>
      <div className="flex flex-col my-4 overflow-x-auto">
        <table>
          <thead className="border-b-1 border-white">
            <tr>
              <th className={averageCellsStyle}>SEASON</th>
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
            {player.seasons.map((season, index) => (
              <SeasonAveragesRows
                key={index}
                season={season.averageStats}
                averageCellsStyle={averageCellsStyle}
              />
            ))}
          </tbody>
          <tfoot className="border-t-1 border-white">
            <tr>
              <td className={averageCellsStyle}>Totals</td>
              <td className={averageCellsStyle}>{player.averageStats.gp}</td>
              <td className={averageCellsStyle}>{player.averageStats.ppg}</td>
              <td className={averageCellsStyle}>{player.averageStats.pm2}</td>
              <td className={averageCellsStyle}>{player.averageStats.pa2}</td>
              <td className={averageCellsStyle}>{player.averageStats.pm3}</td>
              <td className={averageCellsStyle}>{player.averageStats.pa2}</td>
              <td className={averageCellsStyle}>{player.averageStats.ftm}</td>
              <td className={averageCellsStyle}>{player.averageStats.fta}</td>
              <td className={averageCellsStyle}>{player.averageStats.reb}</td>
              <td className={averageCellsStyle}>{player.averageStats.ast}</td>
              <td className={averageCellsStyle}>{player.averageStats.stl}</td>
              <td className={averageCellsStyle}>{player.averageStats.blk}</td>
              <td className={averageCellsStyle}>{player.averageStats.to}</td>
              <td className={averageCellsStyle}>{player.averageStats.pf}</td>
              <td className={averageCellsStyle}>{player.averageStats.ckd}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SeasonAverages;
