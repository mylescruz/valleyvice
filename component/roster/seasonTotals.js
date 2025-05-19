import SeasonTotalsRows from "./seasonTotalsRows";

const SeasonTotals = ({ playerId, seasonsPlayed }) => {
  const totalCellsStyle = "w-1/19 p-1 text-center";

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl text-(--primary) text-center font-bold">
        Season Totals
      </h1>
      <div className="flex flex-col my-4 overflow-x-auto">
        <table>
          <thead className="border-b-1 border-white">
            <tr>
              <th className={totalCellsStyle}>SEASON</th>
              <th className={totalCellsStyle}>GP</th>
              <th className={totalCellsStyle}>PTS</th>
              <th className={totalCellsStyle}>2PM</th>
              <th className={totalCellsStyle}>2PA</th>
              <th className={totalCellsStyle}>2P%</th>
              <th className={totalCellsStyle}>3PM</th>
              <th className={totalCellsStyle}>3PA</th>
              <th className={totalCellsStyle}>3P%</th>
              <th className={totalCellsStyle}>FT</th>
              <th className={totalCellsStyle}>FTA</th>
              <th className={totalCellsStyle}>FT%</th>
              <th className={totalCellsStyle}>REB</th>
              <th className={totalCellsStyle}>AST</th>
              <th className={totalCellsStyle}>STL</th>
              <th className={totalCellsStyle}>BLK</th>
              <th className={totalCellsStyle}>TO</th>
              <th className={totalCellsStyle}>PF</th>
              <th className={totalCellsStyle}>CKD</th>
            </tr>
          </thead>
          <tbody>
            {seasonsPlayed?.map((season) => (
              <SeasonTotalsRows
                key={season.id}
                seasonNumber={season.seasonNumber}
                playerId={playerId}
                totalCellsStyle={totalCellsStyle}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeasonTotals;
