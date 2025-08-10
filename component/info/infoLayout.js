import { InfoContext } from "@/contexts/InfoContext";
import { useContext, useState } from "react";
import LoadingIndicator from "../layout/loadingIndicator";
import NewSeasonForm from "./newSeasonForm";

const buttonStyling =
  "bg-(--secondary) font-bold rounded-lg px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

const emptySeason = {
  id: "",
  seasonNumber: "",
  season: "Winter",
  year: "",
  division: "",
  league: "The Loot x Valley JCC",
  players: [],
};

const InfoLayout = () => {
  const { info, infoLoading } = useContext(InfoContext);

  const [inputNewSeason, setInputNewSeason] = useState(false);
  const [newSeason, setNewSeason] = useState(emptySeason);

  const finishSeason = () => {
    setInputNewSeason(true);
  };

  if (infoLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-(--primary) font-bold mb-4">
          Valley Vice
        </h1>
        <div className="w-full flex flex-col sm:w-11/12 text-center">
          <p className="text-xl mb-4">Current Season: {info.currentSeason}</p>
        </div>

        <p>Season over?</p>
        <button className={buttonStyling} onClick={finishSeason}>
          New Season
        </button>

        {inputNewSeason && (
          <NewSeasonForm
            newSeason={newSeason}
            setNewSeason={setNewSeason}
            emptySeason={emptySeason}
            setInputNewSeason={setInputNewSeason}
          />
        )}
      </div>
    );
  }
};

export default InfoLayout;
