import LoadingIndicator from "../layout/loadingIndicator";
import Image from "next/image";
import SeasonTotals from "./seasonTotals";
import SeasonAverages from "./seasonAverages";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import usePlayer from "@/hooks/usePlayer";

const PlayerLayout = ({ playerId, seasonNum }) => {
  const { player, playerLoading } = usePlayer(playerId);

  const playerAverages = {
    ppg: (
      (player.totalStats?.pm2 * 2 +
        player.totalStats?.pm3 * 3 +
        player.totalStats?.ft) /
      player.totalStats?.gp
    ).toFixed(2),
    reb: (player.totalStats?.reb / player.totalStats?.gp).toFixed(2),
    ast: (player.totalStats?.ast / player.totalStats?.gp).toFixed(2),
    stl: (player.totalStats?.stl / player.totalStats?.gp).toFixed(2),
  };

  const averagesContainer = "flex flex-col text-center";
  const averagesTitleStyling = "text-xl text-(--secondary) font-bold";
  const averagesValueStyling = "font-bold";

  if (playerLoading || !player) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
          <Link
            href={`/roster/${seasonNum}`}
            className="group hover:text-(--secondary)"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="mr-2 group-hover:-translate-x-1.5 duration-300"
            />
            <span className="group-hover:font-bold">Back to Roster</span>
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center">
            <div className="my-4 flex flex-col items-center lg:flex-row lg:justify-start">
              <Image
                src={`/images/${player.imageSrc}`}
                alt="Player Image"
                width={500}
                height={500}
                priority={true}
                className="w-[250px] rounded-full shadow shadow-gray-500 lg:mr-8"
              />
              <div className="flex flex-col mt-4 font-bold">
                <p className="text-3xl">
                  <span className="text-(--primary)">#{player.number}</span>{" "}
                  {player.name}
                </p>

                <div className="text-(--secondary) text-center lg:text-start">
                  <p className="text-xl">{player.height}</p>
                  <p className="text-lg">{player.position}</p>
                </div>
              </div>
            </div>
            <div className="mb-4 flex flex-row flex-wrap justify-evenly border-2 border-(--primary) w-full rounded-lg px-2 p-1 md:w-2/3 md:mx-auto lg:w-1/2 xl:w-1/3">
              <div className={averagesContainer}>
                <p className={averagesTitleStyling}>PPG</p>
                <p className={averagesValueStyling}>{playerAverages.ppg}</p>
              </div>
              <div className={averagesContainer}>
                <p className={averagesTitleStyling}>REB</p>
                <p className={averagesValueStyling}>{playerAverages.reb}</p>
              </div>
              <div className={averagesContainer}>
                <p className={averagesTitleStyling}>AST</p>
                <p className={averagesValueStyling}>{playerAverages.ast}</p>
              </div>
              <div className={averagesContainer}>
                <p className={averagesTitleStyling}>STL</p>
                <p className={averagesValueStyling}>{playerAverages.stl}</p>
              </div>
            </div>
          </div>
          <SeasonAverages
            player={player}
            playerId={player.id}
            seasonsPlayed={player.seasonsPlayed}
          />
          <SeasonTotals
            player={player}
            playerId={player.id}
            seasonsPlayed={player.seasonsPlayed}
          />
        </div>
      </div>
    );
  }
};

export default PlayerLayout;
