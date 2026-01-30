import { useState } from "react";
import EditGameInfoForm from "./editGameInfoForm";

const EditGameLayout = ({ game, setEdit }) => {
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

export default EditGameLayout;
