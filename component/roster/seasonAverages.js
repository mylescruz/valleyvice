import SeasonAveragesRows from "./seasonAveragesRows";

const SeasonAverages = ({ playerId, seasonsPlayed }) => {
  const averageCellsStyle = "w-1/16 p-1 text-center";

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl text-(--primary) text-center font-bold">
        Season Averages
      </h1>
      <div className="flex flex-col my-4 overflow-x-auto">
        <table>
          <thead className="border-b-1 border-white">
            <tr>
              <th className={averageCellsStyle}>SEASON</th>
              <th className={averageCellsStyle}>GP</th>
              <th className={averageCellsStyle}>PPG</th>
              <th className={averageCellsStyle}>2PM</th>
              <th className={averageCellsStyle}>2PA</th>
              <th className={averageCellsStyle}>3PM</th>
              <th className={averageCellsStyle}>3PA</th>
              <th className={averageCellsStyle}>FT</th>
              <th className={averageCellsStyle}>FTA</th>
              <th className={averageCellsStyle}>REB</th>
              <th className={averageCellsStyle}>AST</th>
              <th className={averageCellsStyle}>STL</th>
              <th className={averageCellsStyle}>BLK</th>
              <th className={averageCellsStyle}>TO</th>
              <th className={averageCellsStyle}>PF</th>
              <th className={averageCellsStyle}>CKD</th>
            </tr>
          </thead>
          <tbody>
            {seasonsPlayed?.map((season) => (
              <SeasonAveragesRows
                key={season.id}
                seasonNumber={season.seasonNumber}
                playerId={playerId}
                averageCellsStyle={averageCellsStyle}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeasonAverages;
