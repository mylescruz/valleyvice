import useSeasonStats from "@/hooks/useSeasonStats";
import ErrorLayout from "../layout/errorLayout";
import LoadingIndicator from "../layout/loadingIndicator";
import AverageTable from "./averageTable";
import TotalsTable from "./totalsTable";

const StatsTables = ({ seasonNumber }) => {
  const { seasonStats, seasonStatsLoading } = useSeasonStats(seasonNumber);

  if (seasonStatsLoading) {
    return <LoadingIndicator />;
  } else if (!seasonStats) {
    return <ErrorLayout />;
  } else {
    return (
      <>
        <h1 className="text-3xl text-(--primary) text-center font-bold">
          Total Stats
        </h1>
        <div className="flex flex-col my-4 overflow-x-auto">
          <TotalsTable seasonStats={seasonStats} />
        </div>
        <h1 className="text-3xl text-(--primary) text-center font-bold mt-8">
          Per Game Stats
        </h1>
        <div className="flex flex-col overflow-x-auto my-4">
          <AverageTable seasonStats={seasonStats} />
        </div>
      </>
    );
  }
};

export default StatsTables;
