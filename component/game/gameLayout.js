import dateFormatter from "@/helpers/dateFormatter";
import useSeason from "@/hooks/useSeason";
import {
  faArrowLeft,
  faLocationDot,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import LoadingIndicator from "../layout/loadingIndicator";
import rosterSorter from "@/helpers/rosterSorter";
import ErrorLayout from "../layout/errorLayout";

const TOTAL_CELLS_STYLE = "w-1/19 p-1 text-center";

const GameLayout = ({ seasonNum, gameNum }) => {
  const { season, seasonLoading } = useSeason(seasonNum);

  let game = [];
  let teamTotals = [];
  const noStats = 0;

  if (!seasonLoading && season) {
    game = season.games[gameNum - 1];

    teamTotals = season.games[gameNum - 1].playerStats.reduce(
      (sum, player) => {
        sum.pm2 += player.pm2 ? player.pm2 : noStats;
        sum.pa2 += player.pa2 ? player.pa2 : noStats;
        sum.pm3 += player.pm3 ? player.pm3 : noStats;
        sum.pa3 += player.pa3 ? player.pa3 : noStats;
        sum.ft += player.ft ? player.ft : noStats;
        sum.fta += player.fta ? player.fta : noStats;
        sum.reb += player.reb ? player.reb : noStats;
        sum.ast += player.ast ? player.ast : noStats;
        sum.stl += player.stl ? player.stl : noStats;
        sum.blk += player.blk ? player.blk : noStats;
        sum.to += player.to ? player.to : noStats;
        sum.pf += player.pf ? player.pf : noStats;
        sum.ckd += player.ckd ? player.ckd : noStats;

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
  }

  if (seasonLoading) {
    return <LoadingIndicator />;
  } else if (season) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
          <Link href={"/seasons"} className="group hover:text-(--secondary)">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="mr-2 group-hover:-translate-x-1.5 duration-300"
            />
            <span className="group-hover:font-bold">Back to Seasons</span>
          </Link>
          <div className="text-center flex flex-col">
            <h1 className="text-2xl text-(--primary) text-center font-bold">
              Valley Vice vs {game.opponent}
            </h1>
            {game.result !== "" && (
              <h2 className="text-xl font-bold text-(--secondary)">
                {game.result} {game.totalScore} - {game.opponentScore}
              </h2>
            )}
            <p>
              <FontAwesomeIcon
                icon={faLocationDot}
                className="mr-2 text-(--primary)"
              />
              {game.location}
            </p>
            <p>{dateFormatter(game.date)}</p>
          </div>
          {seasonLoading ? (
            <LoadingIndicator />
          ) : (
            <div className="flex flex-col overflow-x-auto my-4">
              <table>
                <thead className="border-b-1 border-white">
                  <tr>
                    <th className={TOTAL_CELLS_STYLE}>#</th>
                    <th className={TOTAL_CELLS_STYLE}>PLR</th>
                    <th className={TOTAL_CELLS_STYLE}>PTS</th>
                    <th className={TOTAL_CELLS_STYLE}>2PM</th>
                    <th className={TOTAL_CELLS_STYLE}>2PA</th>
                    <th className={TOTAL_CELLS_STYLE}>2P%</th>
                    <th className={TOTAL_CELLS_STYLE}>3PM</th>
                    <th className={TOTAL_CELLS_STYLE}>3PA</th>
                    <th className={TOTAL_CELLS_STYLE}>3P%</th>
                    <th className={TOTAL_CELLS_STYLE}>FT</th>
                    <th className={TOTAL_CELLS_STYLE}>FTA</th>
                    <th className={TOTAL_CELLS_STYLE}>FT%</th>
                    <th className={TOTAL_CELLS_STYLE}>REB</th>
                    <th className={TOTAL_CELLS_STYLE}>AST</th>
                    <th className={TOTAL_CELLS_STYLE}>STL</th>
                    <th className={TOTAL_CELLS_STYLE}>BLK</th>
                    <th className={TOTAL_CELLS_STYLE}>TO</th>
                    <th className={TOTAL_CELLS_STYLE}>PF</th>
                    <th className={TOTAL_CELLS_STYLE}>CKD</th>
                  </tr>
                </thead>
                <tbody>
                  {rosterSorter(game.playerStats).map((player) => (
                    <tr key={player.id}>
                      <td className={TOTAL_CELLS_STYLE}>{player.number}</td>
                      <td className={TOTAL_CELLS_STYLE}>{player.name}</td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.pm2 * 2 +
                          player.pm3 * 3 +
                          (player.ft ? player.ft : noStats)}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.pm2 ? player.pm2 : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.pa2 ? player.pa2 : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.pa2 === 0 || !player.pa2
                          ? `0%`
                          : `${((player.pm2 / player.pa2) * 100).toFixed(0)}%`}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.pm3 ? player.pm3 : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.pa3 ? player.pa3 : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.pa3 === 0 || !player.pa3
                          ? `0%`
                          : `${((player.pm3 / player.pa3) * 100).toFixed(0)}%`}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.ft ? player.ft : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.fta ? player.fta : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.fta === 0 || !player.fta
                          ? `0%`
                          : `${((player.ft / player.fta) * 100).toFixed(0)}%`}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.reb ? player.reb : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.ast ? player.ast : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.stl ? player.stl : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.blk ? player.blk : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.to ? player.to : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.pf ? player.pf : noStats}
                      </td>
                      <td className={TOTAL_CELLS_STYLE}>
                        {player.ckd ? player.ckd : noStats}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-1 border-white">
                    <td className={TOTAL_CELLS_STYLE}>Totals</td>
                    <td className={TOTAL_CELLS_STYLE}></td>
                    <td className={TOTAL_CELLS_STYLE}>
                      {teamTotals.pm2 * 2 + teamTotals.pm3 * 3 + teamTotals.ft}
                    </td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.pm2}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.pa2}</td>
                    <td className={TOTAL_CELLS_STYLE}>
                      {teamTotals.pa2 === 0
                        ? `0%`
                        : `${((teamTotals.pm2 / teamTotals.pa2) * 100).toFixed(
                            0
                          )}%`}
                    </td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.pm3}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.pa3}</td>
                    <td className={TOTAL_CELLS_STYLE}>
                      {teamTotals.pa3 === 0
                        ? `0%`
                        : `${((teamTotals.pm3 / teamTotals.pa3) * 100).toFixed(
                            0
                          )}%`}
                    </td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.ft}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.fta}</td>
                    <td className={TOTAL_CELLS_STYLE}>
                      {teamTotals.fta === 0
                        ? `0%`
                        : `${((teamTotals.ft / teamTotals.fta) * 100).toFixed(
                            0
                          )}%`}
                    </td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.reb}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.ast}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.stl}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.blk}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.to}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.pf}</td>
                    <td className={TOTAL_CELLS_STYLE}>{teamTotals.ckd}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return <ErrorLayout />;
  }
};

export default GameLayout;
