import useAnalytics from "@/hooks/useAnalytics";
import LoadingIndicator from "../layout/loadingIndicator";
import ErrorLayout from "../layout/errorLayout";
import LeadersLayout from "./leaders/leadersLayout";
import TeamLayout from "./team/teamLayout";

const AnalyticsLayout = () => {
  const { analytics, analyticsLoading } = useAnalytics();

  if (analyticsLoading) {
    return <LoadingIndicator />;
  } else if (!analytics) {
    return <ErrorLayout />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5 flex flex-col">
          <TeamLayout teamStats={analytics.teamStats} />
          <LeadersLayout players={analytics.players} />
        </div>
      </div>
    );
  }
};

export default AnalyticsLayout;
