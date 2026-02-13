import useAnalytics from "@/hooks/useAnalytics";
import LoadingIndicator from "../layout/loadingIndicator";
import OpponentsChart from "./opponentsChart";
import ErrorLayout from "../layout/errorLayout";
import LeadersLayout from "./leaders/leadersLayout";

const AnalyticsLayout = () => {
  const { analytics, analyticsLoading } = useAnalytics();

  if (analyticsLoading) {
    return <LoadingIndicator />;
  } else if (!analytics) {
    return <ErrorLayout />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5">
          <LeadersLayout allTimeLeaders={analytics.allTimeLeaders} />
        </div>
      </div>
    );
  }
};

export default AnalyticsLayout;
