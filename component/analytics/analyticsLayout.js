import useAnalytics from "@/hooks/useAnalytics";
import LoadingIndicator from "../layout/loadingIndicator";
import OpponentsChart from "./opponentsChart";
import TotalLeadersChart from "./totalLeadersChart";
import AverageLeadersChart from "./averageLeadersChart";

const AnalyticsLayout = () => {
  const { analytics, analyticsLoading } = useAnalytics();

  if (analyticsLoading && !analytics) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
          <div className="flex flex-col items-center my-4">
            <h1 className="text-center">Average Leaders</h1>
            <AverageLeadersChart
              avgLeaders={analytics.allTimeLeaders.avgLeaders}
            />
          </div>
          <div className="flex flex-col items-center my-4">
            <h1 className="text-center">Total Leaders</h1>
            <TotalLeadersChart
              totalLeaders={analytics.allTimeLeaders.totalLeaders}
            />
          </div>
          <div className="flex flex-col items-center my-4">
            <h1 className="text-center">Most Wins</h1>
            <OpponentsChart opponents={analytics.opponents} />
          </div>
        </div>
      </div>
    );
  }
};

export default AnalyticsLayout;
