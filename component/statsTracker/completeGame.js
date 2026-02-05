import useGames from "@/hooks/useGames";
import { useState } from "react";
import LoadingIndicator from "../layout/loadingIndicator";
import { useRouter } from "next/router";

const gameDetailsInputGroup = "flex flex-col my-1.5";
const gameDetailsInput =
  "border-2 border-(--secondary) rounded-lg py-1 px-2 lg:mr-2";
const buttonStyling =
  "font-bold rounded-lg mx-2 px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

const CompleteGame = ({
  game,
  setGame,
  setCompleteModal,
  deleteTrackedGame,
}) => {
  const { postGame } = useGames();

  const router = useRouter();

  const [status, setStatus] = useState("finalize");

  const handleInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setGame({ ...game, [e.target.id]: input });
    } else {
      setGame({ ...game, [e.target.id]: parseInt(input) });
    }
  };

  const closeComplete = () => {
    setStatus("finalize");
    setCompleteModal(false);
  };

  const submitGame = async () => {
    setStatus("saving");

    try {
      // Post the new game to MongoDB
      await postGame(game);

      // Delete the tracked game from MongoDB
      await deleteTrackedGame();

      setStatus("saved");
    } catch (error) {
      setStatus("error");
      console.error(error);
      return;
    }
  };

  const viewGame = () => {
    router.push(`/games/${game.seasonNumber}/${game.gameNumber}`);
  };

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
      {status === "finalize" && (
        <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) p-4 rounded-lg flex flex-col">
          <h1 className="text-(--primary) text-xl mb-2">Finish Game</h1>
          <p>Enter final scores of the game</p>
          <form className="w-full flex flex-col sm:flex-row sm:justify-between">
            <div className={gameDetailsInputGroup}>
              <label htmlFor="valleyViceScore">Valley Vice</label>
              <input
                id="valleyViceScore"
                type="number"
                onChange={handleInput}
                className={gameDetailsInput}
                value={game.valleyViceScore}
                required
              />
            </div>
            <div className={gameDetailsInputGroup}>
              <label htmlFor="opponentScore">{game.opponent}</label>
              <input
                id="opponentScore"
                type="number"
                onChange={handleInput}
                className={gameDetailsInput}
                value={game.opponentScore}
                required
              />
            </div>
          </form>
          <div className="w-full flex flex-row justify-between mt-4">
            <button
              className={`${buttonStyling} bg-gray-500`}
              onClick={closeComplete}
            >
              Cancel
            </button>
            <button
              className={`${buttonStyling} bg-(--secondary) disabled:bg-gray-500 disabled:cursor-default`}
              disabled={game.opponentScore === ""}
              onClick={submitGame}
            >
              Complete
            </button>
          </div>
        </div>
      )}

      {status === "saving" && (
        <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) p-4 rounded-lg flex flex-col items-center justify-center">
          <h1 className="text-(--primary) text-xl mb-2 text-center">
            Saving Game
          </h1>
          <LoadingIndicator />
        </div>
      )}

      {status === "error" && (
        <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) p-4 rounded-lg flex flex-col">
          <h1 className="text-red text-xl mb-2 text-center">
            Error saving game stats!
          </h1>
          <p className="text-center">Reach out to Myles</p>
          <div className="w-full text-center">
            <button
              className={`${buttonStyling} bg-(--secondary)`}
              onClick={closeComplete}
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {status === "saved" && (
        <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) p-4 rounded-lg flex flex-col">
          <h1 className="text-(--primary) text-xl mb-2 text-center">
            Game Stats Saved!
          </h1>
          <div className="w-full flex flex-row justify-center text-center mt-4">
            <button
              className={`${buttonStyling} bg-(--secondary)`}
              onClick={viewGame}
            >
              View Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteGame;
