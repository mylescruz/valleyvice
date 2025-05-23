import seasonSorter from "@/helpers/seasonSorter";
import SeasonAveragesRows from "./seasonAveragesRows";

const SeasonAverages = ({ player }) => {
  const playerStats = player.totalStats;
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
            {seasonSorter(player.statsPerSeason)?.map((season) => (
              <SeasonAveragesRows
                key={season.id}
                season={season}
                averageCellsStyle={averageCellsStyle}
              />
            ))}
          </tbody>
          <tfoot className="border-t-1 border-white">
            <tr>
              <td className={averageCellsStyle}>Totals</td>
              <td className={averageCellsStyle}>{playerStats?.gp}</td>
              <td className={averageCellsStyle}>
                {(
                  (playerStats?.pm2 * 2 +
                    playerStats?.pm3 * 3 +
                    (playerStats?.ft ? playerStats?.ft : 0)) /
                  playerStats?.gp
                ).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.pm2 / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.pa2 / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.pm3 / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.pa2 / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.ft / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.fta / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.reb / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.ast / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.stl / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.blk / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.to / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.pf / playerStats?.gp).toFixed(2)}
              </td>
              <td className={averageCellsStyle}>
                {(playerStats?.ckd / playerStats?.gp).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SeasonAverages;
