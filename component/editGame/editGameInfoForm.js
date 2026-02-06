const gameDetailsInputGroup = "flex flex-col my-1.5";
const gameDetailsInput = "border-2 border-(--secondary) rounded-lg py-1 px-2";

const EditGameInfoForm = ({ editedGame, setEditedGame }) => {
  const handleInput = (e) => {
    setEditedGame((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    <div className="w-full lg:w-1/4">
      <h2 className="text-xl font-bold text-(--secondary) text-center lg:text-start">
        Game Info
      </h2>
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col">
          <div className={gameDetailsInputGroup}>
            <label htmlFor="date" className="font-bold text-lg">
              Date
            </label>
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
            <label htmlFor="location" className="font-bold text-lg">
              Location
            </label>
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
            <label htmlFor="opponent" className="font-bold text-lg">
              Oppponent
            </label>
            <input
              id="opponent"
              type="text"
              onChange={handleInput}
              className={gameDetailsInput}
              value={editedGame.opponent}
              required
            />
          </div>
          <div className={gameDetailsInputGroup}>
            <label htmlFor="valleyViceScore" className="font-bold text-lg">
              Valley Vice Score
            </label>
            <input
              id="valleyViceScore"
              type="number"
              onChange={handleInput}
              className={gameDetailsInput}
              value={editedGame.valleyViceScore}
              required
            />
          </div>
          <div className={gameDetailsInputGroup}>
            <label htmlFor="opponentScore" className="font-bold text-lg">
              Oppponent Score
            </label>
            <input
              id="opponentScore"
              type="number"
              onChange={handleInput}
              className={gameDetailsInput}
              value={editedGame.opponentScore}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGameInfoForm;
