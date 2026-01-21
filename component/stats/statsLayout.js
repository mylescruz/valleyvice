import { useState } from "react";
import TotalsTable from "./totalsTable";
import AverageTable from "./averageTable";
import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import useInfo from "@/hooks/useInfo";
import useSeasonStats from "@/hooks/useSeasonStats";

const InnerStatsLayout = ({ info }) => {
  const [seasonNumber, setSeasonNumber] = useState(info.currentSeason);

  const { seasonStats, seasonStatsLoading } = useSeasonStats(seasonNumber);

  const selectSeason = (e) => {
    setSeasonNumber(e.target.value);
  };

  if (seasonStatsLoading) {
    return <LoadingIndicator />;
  } else if (!seasonStats) {
    return <ErrorLayout />;
  } else {
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

          <TotalsTable seasonStats={seasonStats} />
          <AverageTable seasonStats={seasonStats} />
        </div>
      </div>
    );
  }
};

const StatsLayout = () => {
  const { info, infoLoading } = useInfo();

  if (infoLoading) {
    return <LoadingIndicator />;
  } else if (!info) {
    return <ErrorLayout />;
  } else {
    return <InnerStatsLayout info={info} />;
  }
};

export default StatsLayout;
