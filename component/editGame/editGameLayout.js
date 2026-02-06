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

const InnerEditGameLayout = ({ game, putGame }) => {
  const [editedGame, setEditedGame] = useState(game);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({});
  const [status, setStatus] = useState("none");

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
    router.push(`/games/${game.seasonNumber}/${game.gameNumber}`);
  };

  const closeComplete = () => {
    setStatus("none");
  };

  const saveEdit = async () => {
    setStatus("loading");

    try {
      await putGame(editedGame);

      setStatus("saved");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <>
      <div className="w-11/12 sm:w-4/5 mx-auto">
        <h1 className="text-xl lg:text-2xl mb-2 text-(--primary) text-center font-bold">
          Edit Game {editedGame.gameNumber} of Season {editedGame.seasonNumber}
        </h1>
        <div className="flex flex-col items-center lg:flex-row lg:items-start">
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

      {status === "error" && (
        <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-(--shadow) z-50 flex flex-col justify-center items-center">
          <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 h-1/2 bg-(--background) p-4 rounded-lg flex flex-col">
            <h1 className="text-(--primary) text-xl mb-2 text-center">
              Error updating the game&#39;s stats!
            </h1>
            <p className="text-center mb-2">Reach out to Myles</p>
            <div className="w-full text-center">
              <button
                className={`${buttonStyling} bg-(--secondary)`}
                onClick={closeComplete}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-(--shadow) z-50 flex flex-col justify-center items-center">
          <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 h-1/2 bg-(--background) p-4 rounded-lg flex flex-col items-center justify-center">
            <h1 className="text-(--primary) text-xl mb-2 text-center">
              Saving Game
            </h1>
            <LoadingIndicator />
          </div>
        </div>
      )}

      {status === "saved" && (
        <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-(--shadow) z-50 flex flex-col justify-center items-center">
          <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) h-1/4 p-4 rounded-lg flex flex-col items-center justify-center">
            <h1 className="text-(--primary) text-xl mb-4 text-center">
              This game&#39;s stats were updated
            </h1>
            <div className="w-full text-center">
              <button
                className={`${buttonStyling} bg-(--secondary)`}
                onClick={closeEdit}
              >
                View Game
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const EditGameLayout = ({ seasonNumber, gameNumber }) => {
  const { game, gameLoading, putGame } = useGame(seasonNumber, gameNumber);

  if (gameLoading) {
    return <LoadingIndicator />;
  } else if (!game) {
    return <ErrorLayout />;
  } else {
    return <InnerEditGameLayout game={game} putGame={putGame} />;
  }
};

export default EditGameLayout;
