import LoadingIndicator from "../layout/loadingIndicator";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import usePlayer from "@/hooks/usePlayer";
import ErrorLayout from "../layout/errorLayout";
import PlayerAverages from "./playerAverages";
import PlayerTotals from "./playerTotals";

const averagesContainer = "flex flex-col text-center";
const averagesTitleStyling = "text-xl text-(--secondary) font-bold";
const averagesValueStyling = "font-bold";

const PlayerLayout = ({ playerId }) => {
  const { player, playerLoading } = usePlayer(playerId);

  if (playerLoading) {
    return <LoadingIndicator />;
  } else if (player) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
          <Link href={"/roster"} className="group hover:text-(--secondary)">
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
                <p className={averagesValueStyling}>
                  {player.averageStats.points.toFixed(2)}
                </p>
              </div>
              <div className={averagesContainer}>
                <p className={averagesTitleStyling}>REB</p>
                <p className={averagesValueStyling}>
                  {player.averageStats.rebounds.toFixed(2)}
                </p>
              </div>
              <div className={averagesContainer}>
                <p className={averagesTitleStyling}>AST</p>
                <p className={averagesValueStyling}>
                  {player.averageStats.assists.toFixed(2)}
                </p>
              </div>
              <div className={averagesContainer}>
                <p className={averagesTitleStyling}>STL</p>
                <p className={averagesValueStyling}>
                  {player.averageStats.steals.toFixed(2)}
                </p>
              </div>
              <div className={averagesContainer}>
                <p className={averagesTitleStyling}>FG%</p>
                <p className={averagesValueStyling}>
                  {player.totalStats.fieldGoalPercentage}%
                </p>
              </div>
            </div>
          </div>
          <PlayerAverages player={player} />
          <PlayerTotals player={player} />
        </div>
      </div>
    );
  } else {
    return <ErrorLayout />;
  }
};

export default PlayerLayout;
