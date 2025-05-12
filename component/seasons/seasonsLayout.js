import useSeason from "@/hooks/useSeason";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import dateFormatter from "@/helpers/dateFormatter";

const SeasonsLayout = () => {
  const { season, seasonLoading } = useSeason(18);

  return (
    <div className="flex flex-col items-center">
      <div className="w-11/12 sm:w-4/5">
        <h1 className="text-3xl text-(--primary) text-center font-bold">
          Seasons
        </h1>
        <div className="my-2 text-center">
          <label htmlFor="season">Choose a season:</label>
          <select
            id="season"
            className="px-2 border-1 border-(--secondary) rounded-lg mx-2 py-1"
          >
            <option>18</option>
          </select>
        </div>
        <div className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-center">
          {seasonLoading ? (
            <h1>Loading</h1>
          ) : (
            season.games.map((game) => (
              <Link
                key={game.id}
                href={{
                  pathname: "/games/[seasonNum]/[gameNum]",
                  query: {
                    seasonNum: season.seasonNumber,
                    gameNum: game.gameNumber,
                  },
                }}
                className="border-2 border-(--secondary) w-full my-4 rounded-lg px-2 p-1 flex flex-col sm:w-2/5 mx-4 sm:aspect-square md:aspect-auto lg:w-1/4"
              >
                <h1 className="text-lg font-bold">
                  Game {game.gameNumber}: {game.opponent}
                </h1>
                <p>
                  <span className="font-bold text-(--primary)">
                    {game.result}
                  </span>{" "}
                  {game.totalScore} - {game.opponentScore}
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="mr-2 text-(--primary)"
                  />
                  {game.location}
                </p>
                <p>{dateFormatter(game.date)}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonsLayout;
