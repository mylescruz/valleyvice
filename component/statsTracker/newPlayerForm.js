import { useState } from "react";

const NewPlayerForm = ({
  players,
  setPlayers,
  setInputPlayer,
  game,
  setGame,
}) => {
  const [newPlayer, setNewPlayer] = useState({
    id: "vvSubs",
    name: "",
    number: "",
    pm2: 0,
    pa2: 0,
    pm3: 0,
    pa3: 0,
    ft: 0,
    fta: 0,
    reb: 0,
    ast: 0,
    stl: 0,
    blk: 0,
    to: 0,
    pf: 0,
    ckd: 0,
  });

  const handleInput = (e) => {
    setNewPlayer({ ...newPlayer, [e.target.id]: e.target.value });
  };

  const handleNumInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setNewPlayer({ ...newPlayer, [e.target.id]: input });
    } else {
      setNewPlayer({ ...newPlayer, [e.target.id]: parseInt(input) });
    }
  };

  const closeEnterPlayer = () => {
    setInputPlayer(false);
  };

  const submitPlayer = (e) => {
    e.preventDefault();

    setPlayers([...players, newPlayer.id]);
    setGame({ ...game, playerStats: [...game.playerStats, newPlayer] });

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
          Enter new player details
        </h1>
        <form onSubmit={submitPlayer} className="w-full flex flex-col">
          <div className={gameDetailsInputGroup}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              onChange={handleInput}
              className={gameDetailsInput}
            />
          </div>
          <div className={gameDetailsInputGroup}>
            <label htmlFor="number">Number</label>
            <input
              id="number"
              type="number"
              onChange={handleNumInput}
              className={gameDetailsInput}
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

export default NewPlayerForm;
