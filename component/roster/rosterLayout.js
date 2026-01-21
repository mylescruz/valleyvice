import LoadingIndicator from "../layout/loadingIndicator";
import { useContext, useState } from "react";
import SeasonRoster from "./seasonRoster";
import { InfoContext } from "@/contexts/InfoContext";
import ErrorLayout from "../layout/errorLayout";

const InnerRosterLayout = ({ info }) => {
  const [seasonNumber, setSeasonNumber] = useState(info.currentSeason);

  const selectSeason = (e) => {
    setSeasonNumber(e.target.value);
  };

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

        <SeasonRoster seasonNumber={seasonNumber} />
      </div>
    </div>
  );
};

const RosterLayout = () => {
  const { info, infoLoading } = useContext(InfoContext);

  if (infoLoading) {
    return <LoadingIndicator />;
  } else if (!info) {
    return <ErrorLayout />;
  } else {
    return <InnerRosterLayout info={info} />;
  }
};

export default RosterLayout;
