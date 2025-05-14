import useRoster from "@/hooks/useRoster";
import Image from "next/image";
import LoadingIndicator from "../layout/loadingIndicator";

const RosterLayout = () => {
  const { roster, rosterLoading } = useRoster();

  if (rosterLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
          <h1 className="text-3xl text-(--primary) text-center font-bold">
            Roster
          </h1>
          <div className="flex flex-col items-center">
            {roster.map((player) => (
              <div
                key={player.id}
                className="w-full border-2 border-(--secondary) rounded-lg my-2 px-4 py-4 sm:w-2/3 lg:w-1/2"
              >
                <div className="flex flex-row">
                  <Image
                    src={`/images/${player.imageSrc}.jpg`}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default RosterLayout;
