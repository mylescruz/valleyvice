import useSeason from "@/hooks/useSeason";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LoadingIndicator from "../layout/loadingIndicator";
import dateFormatter from "@/helpers/dateFormatter";

const SeasonsGames = ({ seasonNumber }) => {
  const { season, seasonLoading } = useSeason(seasonNumber);

  if (seasonLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <>
        <div className="text-center my-4">
          <h1 className="text-3xl text-(--primary) font-bold">
            Season {seasonNumber}
          </h1>
          <p className="text-(--secondary) font-bold">
            {season.season} {season.year}
          </p>
          <p className="text-(--secondary) font-bold">
            {season.league} - {season.division}
          </p>
        </div>
        <h2 className="text-2xl text-(--primary) font-bold">Games</h2>
        <div className="flex flex-col items-center sm:flex-row sm:flex-wrap sm:justify-between">
          {season.games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${seasonNumber}/${game.gameNumber}`}
              className="border-2 border-(--secondary) w-full my-4 rounded-lg px-2 p-1 flex flex-col md:w-4/9 xl:w-1/4 xl:mx-2"
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
      </>
    );
  }
};

export default SeasonsGames;
