const mainStats = "flex flex-col";
const allStats = "hidden lg:flex lg:flex-col";
const statTitle = "font-bold";

const EditGameStats = ({ editedGame }) => {
  return (
    <div className="w-full flex flex-col mt-4 ">
      <h2 className="text-xl font-bold text-(--secondary) mb-2">
        Player Stats
      </h2>
      <div className="flex flex-col justify-start items-start w-full">
        {editedGame.players.map((player) => (
          <div
            key={player.playerId}
            className="mb-4 border-2 border-(--primary) w-full rounded-lg px-2 p-1"
          >
            <div className="flex flex-row justify-between mb-2">
              <p className="text-(--secondary) font-bold">
                #{player.number} {player.name}
              </p>
              <p className="text-(--secondary) font-bold">Edit</p>
            </div>
            <div className="flex flex-row justify-between">
              <div className={mainStats}>
                <h5 className={statTitle}>PTS</h5>
                <p>{player.points}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>2PM</h5>
                <p>{player.twoPointsMade}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>2PA</h5>
                <p>{player.twoPointsAttempted}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>3PM</h5>
                <p>{player.threePointsMade}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>3PA</h5>
                <p>{player.threePointsAttempted}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>FTM</h5>
                <p>{player.freeThrowsMade}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>FTA</h5>
                <p>{player.freeThrowsAttempted}</p>
              </div>
              <div className={mainStats}>
                <h5 className={statTitle}>REB</h5>
                <p>{player.rebounds}</p>
              </div>
              <div className={mainStats}>
                <h5 className={statTitle}>AST</h5>
                <p>{player.assists}</p>
              </div>
              <div className={mainStats}>
                <h5 className={statTitle}>STL</h5>
                <p>{player.steals}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>BLK</h5>
                <p>{player.blocks}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>TO</h5>
                <p>{player.turnovers}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>PF</h5>
                <p>{player.personalFouls}</p>
              </div>
              <div className={allStats}>
                <h5 className={statTitle}>CKD</h5>
                <p>{player.cooked}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditGameStats;
