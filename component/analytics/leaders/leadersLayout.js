import AverageLeadersChart from "./averageLeadersChart";
import TotalLeadersChart from "./totalLeadersChart";

const LeadersLayout = ({ allTimeLeaders }) => {
  return (
    <div>
      <div className="flex flex-col items-center my-4">
        <h1 className="text-center">Average Leaders</h1>
        <AverageLeadersChart avgLeaders={allTimeLeaders.averageLeaders} />
      </div>
      <div className="flex flex-col items-center my-4">
        <h1 className="text-center">Total Leaders</h1>
        <TotalLeadersChart totalLeaders={allTimeLeaders.totalLeaders} />
      </div>
    </div>
  );
};

export default LeadersLayout;
