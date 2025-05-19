import { useState } from "react";
import TotalsTable from "./totalsTable";
import AverageTable from "./averageTable";

const StatsLayout = ({ seasonNum }) => {
  const [seasonNumber, setSeasonNumber] = useState(seasonNum);

  const selectSeason = (e) => {
    setSeasonNumber(e.target.value);
  };

  const seasonsPlayed = [
    { id: "s18", seasonNumber: 18 },
    { id: "s17", seasonNumber: 17 },
    { id: "s16", seasonNumber: 16 },
    { id: "s15", seasonNumber: 15 },
    { id: "s14", seasonNumber: 14 },
    { id: "s13", seasonNumber: 13 },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="w-11/12 sm:w-4/5">
        <div className="mt-2 mb-4 text-center">
          <label htmlFor="season">Choose a season:</label>
          <select
            id="season"
            className="px-2 border-1 border-(--secondary) rounded-lg mx-2 py-1"
            onChange={selectSeason}
            value={seasonNumber}
          >
            {seasonsPlayed.map((season) => (
              <option key={season.id} value={season.seasonNumber}>
                {season.seasonNumber}
              </option>
            ))}
          </select>
        </div>

        <TotalsTable seasonNumber={seasonNumber} />
        <AverageTable seasonNumber={seasonNumber} />
      </div>
    </div>
  );
};

export default StatsLayout;
