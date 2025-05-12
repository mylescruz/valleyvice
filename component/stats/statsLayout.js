const StatsLayout = () => {
  const cellStyle = "w-1/15 p-1";

  return (
    <div className="flex flex-col items-center">
      <div className="w-11/12 sm:w-4/5">
        <h1 className="text-3xl text-(--primary) text-center font-bold">
          Stats
        </h1>
        <div className="flex flex-col items-center my-4">
          <table>
            <thead className="border-b-1 border-white">
              <tr>
                <th className={cellStyle}>PLR</th>
                <th className={cellStyle}>PTS</th>
                <th className={cellStyle}>2PM</th>
                <th className={cellStyle}>2PA</th>
                <th className={cellStyle}>3PM</th>
                <th className={cellStyle}>3PA</th>
                <th className={cellStyle}>FT</th>
                <th className={cellStyle}>FTA</th>
                <th className={cellStyle}>REB</th>
                <th className={cellStyle}>AST</th>
                <th className={cellStyle}>STL</th>
                <th className={cellStyle}>BLK</th>
                <th className={cellStyle}>TO</th>
                <th className={cellStyle}>PF</th>
                <th className={cellStyle}>CKD</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatsLayout;
