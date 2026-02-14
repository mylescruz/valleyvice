import LeadersCard from "./leadersCard";

const LeadersLayout = ({ players }) => {
  const averageLeaders = [...players.careerAverages]
    .filter((player) => player.rank === 1)
    .sort((a, b) => a.statOrder - b.statOrder);

  const totalLeaders = [...players.careerTotals]
    .filter((player) => player.rank === 1)
    .sort((a, b) => a.statOrder - b.statOrder);

  return (
    <div>
      <div className="flex flex-col items-center my-4">
        <h1 className="text-3xl text-(--primary) font-bold mb-2">
          Average Leaders
        </h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
          {averageLeaders.map((stat) => (
            <LeadersCard key={stat._id} stat={stat} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center my-4">
        <h1 className="text-3xl text-(--primary) font-bold mb-2">
          Total Leaders
        </h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
          {totalLeaders.map((stat) => (
            <LeadersCard key={stat._id} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadersLayout;
