import { InfoContext } from "@/contexts/InfoContext";
import { useContext, useState } from "react";
import LoadingIndicator from "../layout/loadingIndicator";
import NewSeasonForm from "./newSeasonForm";

const buttonStyling =
  "bg-(--secondary) font-bold rounded-lg px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";
const playerCellsStyle = "w-1/4 p-1 text-center";

const emptySeason = {
  seasonNumber: "",
  season: "Winter",
  year: "",
  division: "",
  league: "The Loot x Valley JCC",
  players: [
    {
      playerId: "vvSubs",
      name: "Subs",
      number: "0",
      height: "N/A",
      position: "N/A",
      imageSrc: "default.jpg",
    },
  ],
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
  } else if (!info) {
    return (
      <div className="text-center">
        <p className="text-red-600 font-bold">
          Error loading team info! Please try again later!
        </p>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-(--primary) font-bold mb-4">
          Valley Vice
        </h1>
        <div className="w-full flex flex-col sm:w-11/12 text-center">
          <p className="text-xl mb-4">Current Season: {info.currentSeason}</p>
        </div>

        <div className="w-full flex flex-col items-center sm:w-11/12 text-center my-4">
          <p className="text-xl">Current Roster </p>
          <table className="w-full sm:w-1/3 md:w-1/2">
            <thead className="border-b-1 border-white">
              <tr>
                <th className={playerCellsStyle}>#</th>
                <th className={playerCellsStyle}>Name</th>
                <th className={playerCellsStyle}>Height</th>
                <th className={playerCellsStyle}>Position</th>
              </tr>
            </thead>
            <tbody>
              {info.currentRoster.map((player) => (
                <tr key={player.playerId}>
                  <td className={playerCellsStyle}>{player.number}</td>
                  <td className={playerCellsStyle}>{player.name}</td>
                  <td className={playerCellsStyle}>{player.height}</td>
                  <td className={playerCellsStyle}>{player.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="w-full flex flex-col items-center sm:w-11/12 text-center my-4">
          <p>Games Played: {info.totalGames}</p>
          <p>Wins: {info.totalWins}</p>
          <p>Losses: {info.totalLosses}</p>
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
