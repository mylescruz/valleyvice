import { useState } from "react";

const basketballPositions = ["Guard", "Forward", "Center"];

const emptyPlayer = {
  id: "",
  name: "",
  number: "",
  height: "",
  position: basketballPositions[0],
  imageSrc: "default.jpg",
};

const inputGroupStyling = "flex flex-col my-1.5";
const inputStyling = "border-2 border-(--secondary) rounded-lg py-1 px-2";
const buttonStyling =
  "font-bold rounded-lg ml-4 px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

const NewPlayerForm = ({
  roster,
  setRoster,
  newSeason,
  setNewSeason,
  setInputPlayer,
}) => {
  const [newPlayer, setNewPlayer] = useState(emptyPlayer);

  const handleInput = (e) => {
    setNewPlayer({ ...newPlayer, [e.target.id]: e.target.value });
  };

  const closeEnterPlayer = () => {
    setInputPlayer(false);
  };

  const submitPlayer = (e) => {
    e.preventDefault();

    setRoster([...roster, { ...newPlayer, id: newPlayer.name + newPlayer.id }]);
    setNewSeason({
      ...newSeason,
      players: [
        ...newSeason.players,
        { ...newPlayer, id: newPlayer.name + newPlayer.id },
      ],
    });

    closeEnterPlayer();
  };

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
      <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7 bg-(--background) p-4 rounded-lg flex flex-col">
        <h1 className="text-(--primary) text-xl mb-2">
          Enter new player details
        </h1>
        <form onSubmit={submitPlayer} className="w-full flex flex-col">
          <div className={inputGroupStyling}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              onChange={handleInput}
              className={inputStyling}
              value={newPlayer.name}
            />
          </div>
          <div className={inputGroupStyling}>
            <label htmlFor="number">Number</label>
            <input
              id="number"
              type="number"
              onChange={handleInput}
              className={inputStyling}
              value={newPlayer.number}
            />
          </div>
          <div className={inputGroupStyling}>
            <label htmlFor="height">Height</label>
            <input
              id="height"
              type="height"
              placeholder="Example: 6'0 (No double quotation marks)"
              onChange={handleInput}
              className={inputStyling}
              value={newPlayer.height}
            />
          </div>
          <div className={inputGroupStyling}>
            <label htmlFor="position">Position</label>
            <select
              id="position"
              className="p-2 border-1 border-(--secondary) rounded-lg"
              onChange={handleInput}
              value={newPlayer.position}
              required
            >
              {basketballPositions.map((position, index) => (
                <option key={index} value={position}>
                  {position}
                </option>
              ))}
            </select>
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
