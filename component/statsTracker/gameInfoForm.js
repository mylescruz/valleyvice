import { useState } from "react";
import SubstituteForm from "./substituteForm";

const GameInfoForm = ({ game, setGame, setEnterGameInfo }) => {
  const [players, setPlayers] = useState([]);
  const [inputPlayer, setInputPlayer] = useState(false);
  const [gameInfo, setGameInfo] = useState({
    seasonNumber: "",
    gameNumber: "",
    date: "",
    location: "",
    opponent: "",
  });

  const handleInput = (e) => {
    setGameInfo({ ...gameInfo, [e.target.id]: e.target.value });
  };

  const handleNumInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setGameInfo({ ...gameInfo, [e.target.id]: input });
    } else {
      setGameInfo({ ...gameInfo, [e.target.id]: parseInt(input) });
    }
  };

  const enterPlayer = (playerId) => {
    if (players.includes(playerId)) {
      const updatedPlayers = players.filter((player) => player !== playerId);
      setPlayers(updatedPlayers);
    } else {
      setPlayers([...players, playerId]);
    }
  };

  const completeGameInfo = (e) => {
    e.preventDefault();

    const updatedPlayerStats = game.playerStats.filter((player) => {
      if (players.includes(player.id)) {
        return player;
      }
    });

    setGame({
      ...game,
      id: `s${gameInfo.seasonNumber}g${gameInfo.gameNumber}`,
      seasonNumber: gameInfo.seasonNumber,
      gameNumber: gameInfo.gameNumber,
      date: gameInfo.date,
      location: gameInfo.location,
      opponent: gameInfo.opponent,
      playerStats: updatedPlayerStats,
    });

    setEnterGameInfo(false);
  };

  const enterSubstitute = () => {
    setInputPlayer(true);
  };

  const gameDetailsInputGroup = "flex flex-col my-1.5 mx-2";
  const gameDetailsInput = "border-2 border-(--secondary) rounded-lg py-1 px-2";
  const buttonStyling =
    "bg-(--secondary) font-bold rounded-lg px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

  return (
    <div className="flex flex-col items-center">
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
                value={gameInfo.seasonNumber}
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
                value={gameInfo.gameNumber}
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
                value={gameInfo.date}
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
                value={gameInfo.location}
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
                value={gameInfo.opponent}
                required
              />
            </div>
          </div>
          <div className="flex flex-col items-center mt-1.5">
            <p>Who played this game?</p>
            <div className="flex flex-row flex-wrap justify-center lg:w-3/4 xl:w-4/5">
              {game?.playerStats?.map((player) => (
                <div
                  key={player.id}
                  className={`border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold ${
                    players.includes(player.id) && "bg-(--primary) font-bold"
                  }`}
                  onClick={() => {
                    enterPlayer(player.id);
                  }}
                >
                  {player.name}
                </div>
              ))}
              <div
                className="border-2 border-(--secondary) w-[65px] aspect-square rounded-full flex flex-col items-center justify-center m-2 hover:bg-(--primary) hover:cursor-pointer hover:font-bold"
                onClick={enterSubstitute}
              >
                Sub
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

      {inputPlayer && (
        <SubstituteForm
          players={players}
          setPlayers={setPlayers}
          setInputPlayer={setInputPlayer}
          game={game}
          setGame={setGame}
        />
      )}
    </div>
  );
};

export default GameInfoForm;
