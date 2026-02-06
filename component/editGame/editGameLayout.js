import { useState } from "react";
import EditGameInfoForm from "./editGameInfoForm";
import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import useGame from "@/hooks/useGame";
import EditGameStats from "./editGameStats";
import { useRouter } from "next/router";
import EditPlayerStatsModal from "./editPlayerStatsModal";

const buttonStyling =
  "font-bold rounded-lg px-2 py-1 hover:bg-(--primary) hover:cursor-pointer text-nowrap";

const InnerEditGameLayout = ({ game }) => {
  const [editedGame, setEditedGame] = useState(game);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({});

  const router = useRouter();

  const openEditPlayer = (player) => {
    setEditedPlayer(player);

    setOpenEditModal(true);
  };

  const updatePlayerStats = (updatedPlayer) => {
    const updatedPlayers = editedGame.players.map((player) => {
      if (player.playerId === updatedPlayer.playerId) {
        return updatedPlayer;
      }

      return player;
    });

    const teamPoints = updatedPlayers.reduce(
      (sum, current) => sum + current.points,
      0,
    );

    setEditedGame((prev) => ({
      ...prev,
      valleyViceScore: teamPoints,
      players: updatedPlayers,
    }));
  };

  const closeEdit = () => {
    router.push(`game/${game.seasonNumber}/${game.gameNumber}`);
  };

  const saveEdit = () => {
    // PUT method
  };

  return (
    <>
      <div className="w-11/12 sm:w-4/5 mx-auto">
        <h1 className="text-xl lg:text-2xl mb-2 text-(--primary) text-center font-bold">
          Edit Game {editedGame.gameNumber} of Season {editedGame.seasonNumber}
        </h1>
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <EditGameInfoForm
            editedGame={editedGame}
            setEditedGame={setEditedGame}
          />
          <EditGameStats
            editedGame={editedGame}
            openEditPlayer={openEditPlayer}
          />
        </div>
        <div className="flex flex-row justify-between">
          <button
            className={`${buttonStyling} bg-gray-500`}
            onClick={closeEdit}
          >
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

      {openEditModal && (
        <EditPlayerStatsModal
          editedPlayer={editedPlayer}
          setEditedPlayer={setEditedPlayer}
          setOpenEditModal={setOpenEditModal}
          updatePlayerStats={updatePlayerStats}
        />
      )}
    </>
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
