import { useState } from "react";
import EditGameInfoForm from "./editGameInfoForm";
import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import useGame from "@/hooks/useGame";
import EditGameStats from "./editGameStats";
import { useRouter } from "next/router";

const buttonStyling =
  "font-bold rounded-lg px-2 py-1 hover:bg-(--primary) hover:cursor-pointer text-nowrap";

const InnerEditGameLayout = ({ game }) => {
  const [editedGame, setEditedGame] = useState(game);
  const router = useRouter();

  const closeEdit = () => {
    router.push(`game/${game.seasonNumber}/${game.gameNumber}`);
  };

  const saveEdit = () => {
    // PUT method
  };

  return (
    <div className="w-11/12 sm:w-4/5 mx-auto">
      <h1 className="text-xl lg:text-2xl mb-2 text-(--primary) text-center font-bold">
        Edit Game {editedGame.gameNumber} of Season {editedGame.seasonNumber}
      </h1>
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <EditGameInfoForm
          editedGame={editedGame}
          setEditedGame={setEditedGame}
        />
        <EditGameStats editedGame={editedGame} setEditedGame={setEditedGame} />
      </div>
      <div className="flex flex-row justify-between">
        <button className={`${buttonStyling} bg-gray-500`} onClick={closeEdit}>
          Cancel
        </button>
        <button
          className={`${buttonStyling} bg-(--secondary)`}
          onClick={saveEdit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const EditGameLayout = ({ seasonNumber, gameNumber }) => {
  const { game, gameLoading } = useGame(seasonNumber, gameNumber);

  if (gameLoading) {
    return <LoadingIndicator />;
  } else if (!game) {
    return <ErrorLayout />;
  } else {
    return <InnerEditGameLayout game={game} />;
  }
};

export default EditGameLayout;
