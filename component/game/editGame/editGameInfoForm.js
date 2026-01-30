const gameDetailsInputGroup = "flex flex-col my-1.5 mx-2";
const gameDetailsInput = "border-2 border-(--secondary) rounded-lg py-1 px-2";
const buttonStyling =
  "bg-(--secondary) font-bold rounded-lg px-2 py-1 hover:bg-(--primary) hover:cursor-pointer disabled:cursor-auto disabled:bg-gray-500";

const EditGameInfoForm = ({
  editedGame,
  setEditedGame,
  setScreen,
  closeEdit,
}) => {
  const handleInput = (e) => {
    setEditedGame((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const completeGameInfo = () => {
    setScreen("stats");
  };

  return (
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
              onChange={handleInput}
              className={gameDetailsInput}
              value={editedGame.seasonNumber}
              required
            />
          </div>
          <div className={gameDetailsInputGroup}>
            <label htmlFor="gameNumber">Game #</label>
            <input
              id="gameNumber"
              type="number"
              onChange={handleInput}
              className={gameDetailsInput}
              value={editedGame.gameNumber}
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
              value={editedGame.date}
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
              value={editedGame.location}
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
              value={editedGame.opponent}
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-2 text-center flex flex-row justify-between">
        <button type="submit" className={buttonStyling} onClick={closeEdit}>
          Cancel
        </button>
        <button
          type="submit"
          className={buttonStyling}
          disabled={editedGame.players.length < 4}
        >
          Edit Stats
        </button>
      </div>
    </form>
  );
};

export default EditGameInfoForm;
