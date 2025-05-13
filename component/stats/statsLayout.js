import { useState } from "react";
import TotalsTable from "./totalsTable";
import PerGameTable from "./PerGameTable";

const StatsLayout = ({ seasonNum }) => {
  const [seasonNumber, setSeasonNumber] = useState(seasonNum);

  const selectSeason = (e) => {
    setSeasonNumber(e.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-11/12 sm:w-4/5">
        <div className="my-2 text-center">
          <label htmlFor="season">Choose a season:</label>
          <select
            id="season"
            className="px-2 border-1 border-(--secondary) rounded-lg mx-2 py-1"
            onChange={selectSeason}
            value={seasonNumber}
          >
            <option value={18}>18</option>
            <option value={17}>17</option>
          </select>
        </div>

        <TotalsTable seasonNumber={seasonNumber} />
        <PerGameTable seasonNumber={seasonNumber} />
      </div>
    </div>
  );
};

export default StatsLayout;
