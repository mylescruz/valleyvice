import useSeason from "@/hooks/useSeason";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import dateFormatter from "@/helpers/dateFormatter";
import LoadingIndicator from "../layout/loadingIndicator";

const SeasonsLayout = ({ seasonNum }) => {
  const { season, seasonLoading } = useSeason(seasonNum);

  if (seasonLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
          <div className="my-2 text-center">
            <label htmlFor="season">Choose a season:</label>
            <select
              id="season"
              className="px-2 border-1 border-(--secondary) rounded-lg mx-2 py-1"
            >
              <option>{seasonNum}</option>
            </select>
          </div>

          <div className="text-center my-4">
            <h1 className="text-3xl text-(--primary) font-bold">
              Season {seasonNum}
            </h1>
            <p className="text-(--secondary) font-bold">
              {season.season} {season.year}
            </p>
            <p className="text-(--secondary) font-bold">
              {season.league} - {season.division}
            </p>
          </div>
          <h2 className="text-2xl text-(--primary) font-bold">Games</h2>
          <div className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-between ">
            {season.games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${seasonNum}/${game.gameNumber}`}
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
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default SeasonsLayout;
