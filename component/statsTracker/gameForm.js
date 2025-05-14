const GameForm = ({ game, setGame }) => {
  const handleInput = (e) => {
    setGame({ ...game, [e.target.id]: e.target.value });
  };

  const handleNumberInput = (e) => {
    const input = e.target.value;

    if (input === "") {
      setGame({ ...game, [e.target.id]: e.target.value });
    } else {
      setGame({
        ...game,
        [e.target.id]: parseInt(e.target.value),
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
          <label htmlFor="gameNumber">Game #</label>
          <input
            id="gameNumber"
            type="number"
            onChange={handleNumberInput}
            className={gameDetailsInput}
          />
        </div>
        <div className={gameDetailsInputGroup}>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            onChange={handleInput}
            className={gameDetailsInput}
          />
        </div>
        <div className={gameDetailsInputGroup}>
          <label htmlFor="location">Location</label>
          <input
            id="location"
            onChange={handleInput}
            className={gameDetailsInput}
          />
        </div>
        <div className={gameDetailsInputGroup}>
          <label htmlFor="opponent">Oppponent</label>
          <input
            id="opponent"
            onChange={handleInput}
            className={gameDetailsInput}
          />
        </div>
      </form>
    </div>
  );
};

export default GameForm;
