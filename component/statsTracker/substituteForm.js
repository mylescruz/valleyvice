import { useState } from "react";

const SubstituteForm = ({
  players,
  setPlayers,
  setInputPlayer,
  game,
  setGame,
}) => {
  const [substitutePlayer, setSubstitutePlayer] = useState({
    playerId: "",
    name: "",
    number: "",
    twoPointsMade: 0,
    twoPointsAttempted: 0,
    threePointsMade: 0,
    threePointsAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    personalFouls: 0,
    cooked: 0,
  });

  const handleInput = (e) => {
    setSubstitutePlayer({ ...substitutePlayer, [e.target.id]: e.target.value });
  };

  const closeEnterPlayer = () => {
    setInputPlayer(false);
  };

  const submitPlayer = (e) => {
    e.preventDefault();

    // Define the substitute's playerId
    const substitutePlayerId = `${substitutePlayer.name}${substitutePlayer.number}`;

    setPlayers([...players, substitutePlayerId]);
    setGame({
      ...game,
      players: [
        ...game.players,
        { ...substitutePlayer, playerId: substitutePlayerId },
      ],
    });

    closeEnterPlayer();
  };

  const gameDetailsInputGroup = "flex flex-col my-1.5";
  const gameDetailsInput = "border-2 border-(--secondary) rounded-lg py-1 px-2";
  const buttonStyling =
    "font-bold rounded-lg ml-4 px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
      <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) p-4 rounded-lg flex flex-col">
        <h1 className="text-(--primary) text-xl mb-2">
          Enter substitute&#39;s details
        </h1>
        <form onSubmit={submitPlayer} className="w-full flex flex-col">
          <div className={gameDetailsInputGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              onChange={handleInput}
              className={gameDetailsInput}
              value={substitutePlayer.name}
            />
          </div>
          <div className={gameDetailsInputGroup}>
            <label htmlFor="number">Number</label>
            <input
              id="number"
              type="number"
              onChange={handleInput}
              className={gameDetailsInput}
              value={substitutePlayer.number}
            />
          </div>
          <div className="flex flex-row justify-end mt-4">
            <button
              className={`${buttonStyling} bg-gray-500`}
              onClick={closeEnterPlayer}
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

export default SubstituteForm;
