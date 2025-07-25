import useSeason from "@/hooks/useSeason";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LoadingIndicator from "../layout/loadingIndicator";
import dateFormatter from "@/helpers/dateFormatter";
import gameSorter from "@/helpers/gameSorter";
import ErrorLayout from "../layout/errorLayout";

const SeasonsGames = ({ seasonNumber }) => {
  const { season, seasonLoading } = useSeason(seasonNumber);

  if (seasonLoading) {
    return <LoadingIndicator />;
  } else if (season) {
    return (
      <>
        <div className="text-center my-4">
          <h1 className="text-3xl text-(--primary) font-bold">
            Season {seasonNumber}
          </h1>
          {season.wins && (
            <p className="text-xl text-(--secondary) font-bold">
              Record: {season.wins} - {season.losses}
            </p>
          )}
          <p className="font-bold">
            {season.season} {season.year}
          </p>
          <p className="font-bold">
            {season.league} - {season.division}
          </p>
        </div>
        <h2 className="text-2xl text-(--primary) font-bold">Games</h2>
        <div className="flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gameSorter(season.games).map((game) => (
            <Link
              key={game.id}
              href={`/games/${seasonNumber}/${game.gameNumber}`}
              className="border-2 border-(--secondary) w-full my-4 rounded-lg px-2 p-1 flex flex-col sm:w-11/12"
            >
              <div className="flex flex-row justify-between">
                <h1 className="font-bold">Game {game.gameNumber}</h1>
                {game.result !== "" && (
                  <p className="font-bold">
                    <span
                      className={`${game.result === "W" ? "text-(--primary)" : "text-(--secondary)"}`}
                    >
                      {game.result}
                    </span>{" "}
                    {game.totalScore} - {game.opponentScore}
                  </p>
                )}
              </div>
              <p className="font-bold text-lg text-(--primary)">
                {game.opponent}
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
  } else {
    return <ErrorLayout />;
  }
};

export default SeasonsGames;
