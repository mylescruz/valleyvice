import dateFormatter from "@/helpers/dateFormatter";
import useSeason from "@/hooks/useSeason";
import { faArrowLeft, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import LoadingIndicator from "../layout/loadingIndicator";
import rosterSorter from "@/helpers/rosterSorter";

const GameLayout = ({ seasonNum, gameNum }) => {
  const { season, seasonLoading } = useSeason(seasonNum);

  let game = [];
  let teamTotals = [];
  const noStats = 0;

  if (!seasonLoading) {
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

  const totalCellsStyle = "w-1/19 p-1 text-center";

  if (seasonLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
          <Link
            href={`/seasons/${seasonNum}`}
            className="group hover:text-(--secondary)"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="mr-2 group-hover:-translate-x-1.5 duration-300"
            />
            <span className="group-hover:font-bold">
              Back to Season {seasonNum}
            </span>
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
                    <th className={totalCellsStyle}>#</th>
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
                  {rosterSorter(game.playerStats).map((player) => (
                    <tr key={player.id}>
                      <td className={totalCellsStyle}>{player.number}</td>
                      <td className={totalCellsStyle}>{player.name}</td>
                      <td className={totalCellsStyle}>
                        {player.pm2 * 2 +
                          player.pm3 * 3 +
                          (player.ft ? player.ft : noStats)}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.pm2 ? player.pm2 : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.pa2 ? player.pa2 : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.pa2 === 0 || !player.pa2
                          ? `0%`
                          : `${((player.pm2 / player.pa2) * 100).toFixed(0)}%`}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.pm3 ? player.pm3 : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.pa3 ? player.pa3 : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.pa3 === 0 || !player.pa3
                          ? `0%`
                          : `${((player.pm3 / player.pa3) * 100).toFixed(0)}%`}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.ft ? player.ft : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.fta ? player.fta : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.fta === 0 || !player.fta
                          ? `0%`
                          : `${((player.ft / player.fta) * 100).toFixed(0)}%`}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.reb ? player.reb : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.ast ? player.ast : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.stl ? player.stl : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.blk ? player.blk : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.to ? player.to : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.pf ? player.pf : noStats}
                      </td>
                      <td className={totalCellsStyle}>
                        {player.ckd ? player.ckd : noStats}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-1 border-white">
                    <td className={totalCellsStyle}>Totals</td>
                    <td className={totalCellsStyle}></td>
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
          )}
        </div>
      </div>
    );
  }
};

export default GameLayout;
