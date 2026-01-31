import { useState } from "react";
import EditGameInfoForm from "./editGameInfoForm";
import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import useGame from "@/hooks/useGame";

const InnerEditGameLayout = ({ game }) => {
  const [editedGame, setEditedGame] = useState(game);
  const [screen, setScreen] = useState("details");

  const closeEdit = () => {
    setEdit(false);
  };

  return (
    <div>
      {screen === "details" && (
        <EditGameInfoForm
          editedGame={editedGame}
          setEditedGame={setEditedGame}
          setScreen={setScreen}
          closeEdit={closeEdit}
        />
      )}
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
