import useRoster from "@/hooks/useRoster";
import LoadingIndicator from "../layout/loadingIndicator";
import { useEffect, useState } from "react";
import Image from "next/image";
import SeasonTotals from "./seasonTotals";
import SeasonAverages from "./seasonAverages";

const PlayerLayout = ({ playerId }) => {
  const { roster, rosterLoading } = useRoster();

  const [player, setPlayer] = useState({});

  useEffect(() => {
    if (!rosterLoading && roster) {
      const foundPlayer = roster?.find((player) => player.id === playerId);

      setPlayer(foundPlayer);
    }
  }, [roster, rosterLoading, playerId]);

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

  if (rosterLoading || !roster || !player) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
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
          <SeasonAverages playerId={player.id} />
          <SeasonTotals playerId={player.id} />
        </div>
      </div>
    );
  }
};

export default PlayerLayout;
