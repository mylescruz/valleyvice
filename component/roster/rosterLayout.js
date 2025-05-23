import LoadingIndicator from "../layout/loadingIndicator";
import { useContext, useState } from "react";
import SeasonRoster from "./seasonRoster";
import { InfoContext } from "@/contexts/InfoContext";

const RosterLayout = ({ seasonNum }) => {
  const { info, infoLoading } = useContext(InfoContext);
  const [seasonNumber, setSeasonNumber] = useState(seasonNum);

  const selectSeason = (e) => {
    setSeasonNumber(e.target.value);
  };

  if (infoLoading) {
    return <LoadingIndicator />;
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
                <option key={season.id} value={season.seasonNumber}>
                  {season.seasonNumber}
                </option>
              ))}
            </select>
          </div>

          <SeasonRoster seasonNumber={seasonNumber} />
        </div>
      </div>
    );
  }
};

export default RosterLayout;
