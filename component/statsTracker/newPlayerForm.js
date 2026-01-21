import { useState } from "react";

const NewPlayerForm = ({
  game,
  setGame,
  availablePlayers,
  setAvailablePlayers,
  setSubsModal,
}) => {
  const [newPlayer, setNewPlayer] = useState({
    playerId: "",
    name: "",
    number: "",
  });

  const handleInput = (e) => {
    setNewPlayer({ ...newPlayer, [e.target.id]: e.target.value });
  };

  // Add the new player to the game's roster and available players
  const submitPlayer = (e) => {
    e.preventDefault();

    // Define the substitute's playerId
    const newPlayerId = `${newPlayer.name.toLowerCase()}${newPlayer.number}`;

    setAvailablePlayers([
      ...availablePlayers,
      { ...newPlayer, playerId: newPlayerId },
    ]);
    setGame({
      ...game,
      players: [...game.players, { ...newPlayer, playerId: newPlayerId }],
    });

    setSubsModal("none");
  };

  const gameDetailsInputGroup = "flex flex-col my-1.5";
  const gameDetailsInput = "border-2 border-(--secondary) rounded-lg py-1 px-2";
  const buttonStyling =
    "font-bold rounded-lg ml-4 px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
      <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) p-4 rounded-lg flex flex-col">
        <h1 className="text-(--primary) text-xl mb-2">
          Enter new player&#39;s details
        </h1>
        <form onSubmit={submitPlayer} className="w-full flex flex-col">
          <div className={gameDetailsInputGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              onChange={handleInput}
              className={gameDetailsInput}
              value={newPlayer.name}
              required
            />
          </div>
          <div className={gameDetailsInputGroup}>
            <label htmlFor="number">Number</label>
            <input
              id="number"
              type="number"
              onChange={handleInput}
              className={gameDetailsInput}
              value={newPlayer.number}
              required
            />
          </div>
          <div className="flex flex-row justify-end mt-4">
            <button
              className={`${buttonStyling} bg-gray-500`}
              onClick={() => setSubsModal("none")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${buttonStyling} bg-(--secondary)`}
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPlayerForm;
