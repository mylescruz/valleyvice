import { useState } from "react";
import EditGameInfoForm from "./editGameInfoForm";
import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import useGame from "@/hooks/useGame";
import EditGameStats from "./editGameStats";

const InnerEditGameLayout = ({ game }) => {
  const [editedGame, setEditedGame] = useState(game);

  return (
    <div className="w-11/12 sm:w-4/5 mx-auto">
      <h1 className="text-2xl text-(--primary) text-center font-bold">
        Edit Game {editedGame.gameNumber} of Season {editedGame.seasonNumber}
      </h1>
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <EditGameInfoForm
          editedGame={editedGame}
          setEditedGame={setEditedGame}
        />
        <EditGameStats editedGame={editedGame} setEditedGame={setEditedGame} />
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
