import { useEffect, useState } from "react";
import TotalsTable from "./totalsTable";
import AverageTable from "./averageTable";
import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import useInfo from "@/hooks/useInfo";

const StatsLayout = () => {
  const { info, infoLoading } = useInfo();
  const [seasonNumber, setSeasonNumber] = useState(null);

  useEffect(() => {
    if (!infoLoading && info) {
      setSeasonNumber(info.currentSeason);
    }
  }, [info, infoLoading]);

  const selectSeason = (e) => {
    setSeasonNumber(e.target.value);
  };

  if (infoLoading && !info && !seasonNumber) {
    return <LoadingIndicator />;
  } else if (info && seasonNumber) {
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
              {info.seasonsPlayed.map((season) => (
                <option key={season} value={season}>
                  {season}
                </option>
              ))}
            </select>
          </div>

          <TotalsTable seasonNumber={seasonNumber} />
          <AverageTable seasonNumber={seasonNumber} />
        </div>
      </div>
    );
  } else {
    return <ErrorLayout />;
  }
};

export default StatsLayout;
