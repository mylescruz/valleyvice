import Image from "next/image";
import Link from "next/link";
import LoadingIndicator from "../layout/loadingIndicator";
import useRoster from "@/hooks/useRoster";
import rosterSorter from "@/helpers/rosterSorter";

const SeasonRoster = ({ seasonNumber }) => {
  const { roster, rosterLoading } = useRoster(seasonNumber);

  if (rosterLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-(--primary) text-center font-bold mb-4">
          Season {seasonNumber} Roster
        </h1>
        {rosterSorter(roster).map(
          (player) =>
            player.id !== "vvSubs" && (
              <Link
                key={player.id}
                href={{
                  pathname: "/player/[playerId]",
                  query: { playerId: player.id, seasonNum: seasonNumber },
                }}
                className="w-full border-2 border-(--secondary) rounded-lg my-2 px-4 py-4 sm:w-2/3 lg:w-1/2"
              >
                <div className="flex flex-row">
                  <Image
                    src={`/images/${player.imageSrc}`}
                    alt="Player Image"
                    width={500}
                    height={500}
                    className="w-[100px] rounded-full shadow shadow-gray-500"
                  />
                  <div className="flex flex-col justify-evenly ml-4">
                    <p className="text-xl">
                      <span className="text-(--primary) font-bold">
                        #{player.number}
                      </span>{" "}
                      {player.name}
                    </p>

                    <p>{player.height}</p>
                    <p>{player.position}</p>
                  </div>
                </div>
              </Link>
            )
        )}
      </div>
    );
  }
};

export default SeasonRoster;
