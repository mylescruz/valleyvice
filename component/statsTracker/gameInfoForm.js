import { useEffect, useState } from "react";
import NewPlayerForm from "./newPlayerForm";
import ChooseSubs from "./chooseSubs";

const GameInfoForm = ({ info, infoLoading, game, setGame, setScreen }) => {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [chooseSubs, setChooseSubs] = useState(false);
  const [inputPlayer, setInputPlayer] = useState(false);

  // Set the available players from the current roster
  useEffect(() => {
    if (!infoLoading && info) {
      const currentRoster = info.currentRoster
        .filter((player) => player.playerId !== "vvSubs")
        .map((player) => {
          return {
            playerId: player.playerId,
            name: player.name,
            number: player.number,
          };
        })
        .sort((player1, player2) => player1.number - player2.number);

      setAvailablePlayers(currentRoster);
    }
  }, [info, infoLoading]);

  const handleInput = (e) => {
    setGame({ ...game, [e.target.id]: e.target.value });
  };

  const handleNumInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setGame({ ...game, [e.target.id]: input });
    } else {
      setGame({ ...game, [e.target.id]: parseInt(input) });
    }
  };

  // Adds or remove a player to the roster for the game
  const managePlayers = (playerId) => {
    // Add the selected player to the game's roster if they're not already there
    if (!game.players.some((player) => player.playerId === playerId)) {
      const addedPlayer = availablePlayers.find(
        (player) => player.playerId === playerId,
      );
      setGame({ ...game, players: [...game.players, addedPlayer] });
    } else {
      // Remove the player from the game roster if they are already there
      const updatedPlayers = game.players.filter(
        (player) => player.playerId !== playerId,
      );
      setGame({ ...game, players: updatedPlayers });
    }
  };

  // Update the selected players for the game
  const completeGameInfo = (e) => {
    e.preventDefault();

    const updatedPlayers = game.players
      .map((player) => {
        return {
          ...player,
          points: 0,
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
        };
      })
      .sort((player1, player2) => player1.number - player2.number);

    setGame({ ...game, players: updatedPlayers });

    setScreen("tracker");
  };

  const enterNewPlayer = () => {
    setInputPlayer(true);
  };

  const closeEnterNewPlayer = () => {
    setInputPlayer(false);
  };

  const enterSubstitute = () => {
    setChooseSubs(true);
  };

  const closeChooseSubs = () => {
    setChooseSubs(false);
  };

  const gameDetailsInputGroup = "flex flex-col my-1.5 mx-2";
  const gameDetailsInput = "border-2 border-(--secondary) rounded-lg py-1 px-2";
  const buttonStyling =
    "bg-(--secondary) font-bold rounded-lg px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-(--primary) text-center">
        Enter Game Info
      </h1>
      <form
        className="w-full my-4 flex flex-col items-center sm:w-4/5 lg:w-2/3 xl:w-1/2"
        onSubmit={completeGameInfo}
      >
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col">
            <div className={gameDetailsInputGroup}>
              <label htmlFor="seasonNumber">Season #</label>
              <input
                id="seasonNumber"
                type="number"
                onChange={handleNumInput}
                className={gameDetailsInput}
                value={game.seasonNumber}
                required
              />
            </div>
            <div className={gameDetailsInputGroup}>
              <label htmlFor="gameNumber">Game #</label>
              <input
                id="gameNumber"
                type="number"
                onChange={handleNumInput}
                className={gameDetailsInput}
                value={game.gameNumber}
                required
              />
            </div>
            <div className={gameDetailsInputGroup}>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                onChange={handleInput}
                className={gameDetailsInput}
                value={game.date}
                required
              />
            </div>
            <div className={gameDetailsInputGroup}>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                onChange={handleInput}
                className={gameDetailsInput}
                value={game.location}
                required
              />
            </div>
            <div className={gameDetailsInputGroup}>
              <label htmlFor="opponent">Oppponent</label>
              <input
                id="opponent"
                type="text"
                onChange={handleInput}
                className={gameDetailsInput}
                value={game.opponent}
                required
              />
            </div>
          </div>
          <div className="flex flex-col items-center mt-1.5">
            <p>Who played this game?</p>
            <div className="flex flex-row flex-wrap justify-center lg:w-3/4 xl:w-4/5">
              {availablePlayers.map((player) => (
                <div
                  key={player.playerId}
                  className={`border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold ${
                    game.players.some((p) => p.playerId === player.playerId) &&
                    "bg-(--primary) font-bold"
                  }`}
                  onClick={() => {
                    managePlayers(player.playerId);
                  }}
                >
                  {player.name}
                </div>
              ))}
              <div
                className="border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold"
                onClick={enterSubstitute}
              >
                Subs?
              </div>
              <div
                className="border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold"
                onClick={enterNewPlayer}
              >
                New?
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <button type="submit" className={buttonStyling}>
            Enter
          </button>
        </div>
      </form>

      {chooseSubs && (
        <ChooseSubs
          info={info}
          infoLoading={infoLoading}
          game={game}
          setGame={setGame}
          availablePlayers={availablePlayers}
          setAvailablePlayers={setAvailablePlayers}
          closeChooseSubs={closeChooseSubs}
        />
      )}
      {inputPlayer && (
        <NewPlayerForm
          game={game}
          setGame={setGame}
          availablePlayers={availablePlayers}
          setAvailablePlayers={setAvailablePlayers}
          closeEnterNewPlayer={closeEnterNewPlayer}
        />
      )}
    </div>
  );
};

export default GameInfoForm;
