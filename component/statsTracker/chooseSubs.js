import { useEffect, useMemo, useState } from "react";

const ChooseSubs = ({
  info,
  game,
  setGame,
  availablePlayers,
  setAvailablePlayers,
  closeChooseSubs,
}) => {
  const availableSubs = useMemo(() => {
    return info.allPlayers
      .filter((sub) => {
        return !info.currentRoster.some(
          (player) => player.playerId === sub.playerId,
        );
      })
      .filter((sub) => {
        return !availablePlayers.some((playerId) => playerId === sub.playerId);
      })
      .filter((sub) => {
        return !game.players.some((player) => player.playerId === sub.playerId);
      })
      .filter((sub) => sub.playerId !== "vvSubs");
  }, [info, game, availablePlayers]);
  const [chosenSubs, setChosenSubs] = useState([]);

  // Add or remove a sub from the chosen subs for the game
  const manageSubs = (playerId) => {
    // If a sub is clicked, add them to the chosen subs
    if (!chosenSubs.some((sub) => sub.playerId === playerId)) {
      const sub = availableSubs.find((sub) => sub.playerId === playerId);
      setChosenSubs([...chosenSubs, sub]);
    } else {
      // If a selected sub is clicked again, remove them from the array
      const updatedSubs = chosenSubs.filter((sub) => sub.playerId !== playerId);
      setChosenSubs(updatedSubs);
    }
  };

  // Add the selected subs to the game and available players
  const submitSubs = () => {
    setAvailablePlayers([...availablePlayers, ...chosenSubs]);
    setGame({
      ...game,
      players: [...game.players, ...chosenSubs],
    });

    closeChooseSubs();
  };

  const buttonStyling =
    "font-bold rounded-lg ml-4 px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
      <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-1/3 bg-(--background) p-4 rounded-lg flex flex-col">
        <h1 className="text-(--primary) text-center text-xl mb-2">
          Choose which subs are playing
        </h1>
        <div className="flex flex-col items-center mt-1.5">
          <div className="flex flex-row flex-wrap justify-center lg:w-3/4 xl:w-4/5">
            {availableSubs.map((player) => (
              <div
                key={player.playerId}
                className={`border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold ${
                  chosenSubs.some((p) => p.playerId === player.playerId) &&
                  "bg-(--primary) font-bold"
                }`}
                onClick={() => {
                  manageSubs(player.playerId);
                }}
              >
                <p className="text-center">{player.name}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-end mt-4">
            <button
              className={`${buttonStyling} bg-gray-500`}
              onClick={closeChooseSubs}
            >
              Cancel
            </button>
            <button
              className={`${buttonStyling} bg-(--secondary)`}
              onClick={submitSubs}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseSubs;
