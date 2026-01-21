import dateFormatter from "@/helpers/dateFormatter";
import { faArrowLeft, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import useGame from "@/hooks/useGame";
import PlayByPlay from "./playByPlay";

const TOTAL_CELLS_STYLE = "w-1/19 p-1 text-center";

const GameLayout = ({ seasonNumber, gameNumber }) => {
  const { game, gameLoading } = useGame(seasonNumber, gameNumber);

  if (gameLoading) {
    return <LoadingIndicator />;
  } else if (!game) {
    return <ErrorLayout />;
  } else {
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
            {game.valleyViceScore && game.opponentScore && (
              <h2 className="text-xl font-bold text-(--secondary)">
                {game.result} {game.valleyViceScore} - {game.opponentScore}
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
                  <th className={TOTAL_CELLS_STYLE}>FTM</th>
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
                {game.players.map((player, index) => (
                  <tr key={index}>
                    <td className={TOTAL_CELLS_STYLE}>{player.number}</td>
                    <td className={TOTAL_CELLS_STYLE}>{player.name}</td>
                    {Object.entries(player).map(
                      ([key, value]) =>
                        !["playerId", "name", "number"].includes(key) && (
                          <td key={key} className={TOTAL_CELLS_STYLE}>
                            {value}
                            {key.includes("Percentage") && "%"}
                          </td>
                        ),
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-1 border-white">
                  <td className={TOTAL_CELLS_STYLE}>Totals</td>
                  <td className={TOTAL_CELLS_STYLE}></td>
                  <td className={TOTAL_CELLS_STYLE}>{game.teamStats.points}</td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.twoPointsMade}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.twoPointsAttempted}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.twoPointPercentage}%
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.threePointsMade}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.threePointsAttempted}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.threePointPercentage}%
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.freeThrowsMade}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.freeThrowsAttempted}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.freeThrowPercentage}%
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.rebounds}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.assists}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>{game.teamStats.steals}</td>
                  <td className={TOTAL_CELLS_STYLE}>{game.teamStats.blocks}</td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.turnovers}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>
                    {game.teamStats.personalFouls}
                  </td>
                  <td className={TOTAL_CELLS_STYLE}>{game.teamStats.cooked}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {game.playByPlay && <PlayByPlay playByPlay={game.playByPlay} />}
      </div>
    );
  }
};

export default GameLayout;
