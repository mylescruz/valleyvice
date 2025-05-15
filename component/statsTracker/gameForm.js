const GameForm = ({ game, setGame, setGameOverDisabled }) => {
  const handleInput = (e) => {
    setGame({ ...game, [e.target.id]: e.target.value });
  };

  const handleIdInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setGame({
        ...game,
        id: `s${input}g${game.gameNumber}`,
        seasonNumber: input,
      });

      setGameOverDisabled(true);
    } else {
      setGame({
        ...game,
        id: `s${parseInt(input)}g${game.gameNumber}`,
        seasonNumber: parseInt(input),
      });

      setGameOverDisabled(false);
    }
  };

  const handleGameInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setGame({
        ...game,
        id: `s${game.seasonNumber}g${input}`,
        gameNumber: input,
      });
    } else {
      setGame({
        ...game,
        id: `s${game.seasonNumber}g${parseInt(input)}`,
        gameNumber: parseInt(input),
      });
    }
  };

  const gameDetailsInputGroup = "flex flex-col my-1.5";
  const gameDetailsInput =
    "border-2 border-(--secondary) rounded-lg py-1 px-2 lg:mr-4";

  return (
    <div className="flex flex-col items-center">
      <form className="w-full sm:w-1/2 my-4 xl:w-1/4 flex flex-col lg:flex-row lg:justify-center">
        <div className={gameDetailsInputGroup}>
          <label htmlFor="seasonNumber">Season #</label>
          <input
            id="seasonNumber"
            type="number"
            onChange={handleIdInput}
            className={gameDetailsInput}
            value={game.seasonNumber}
          />
        </div>
        <div className={gameDetailsInputGroup}>
          <label htmlFor="gameNumber">Game #</label>
          <input
            id="gameNumber"
            type="number"
            onChange={handleGameInput}
            className={gameDetailsInput}
            value={game.gameNumber}
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
          />
        </div>
        <div className={gameDetailsInputGroup}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            onChange={handleInput}
            className={gameDetailsInput}
            value={game.location}
          />
        </div>
        <div className={gameDetailsInputGroup}>
          <label htmlFor="opponent">Oppponent</label>
          <input
            id="opponent"
            onChange={handleInput}
            className={gameDetailsInput}
            value={game.opponent}
          />
        </div>
      </form>
    </div>
  );
};

export default GameForm;
