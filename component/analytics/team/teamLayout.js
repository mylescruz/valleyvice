import TeamStatCard from "./teamStatCard";

const TeamLayout = ({ teamStats }) => {
  const totalStats = [...teamStats]
    .filter((stat) => stat.valueType === "total")
    .map((stat) => {
      return {
        statKey: stat.statName,
        value: stat.value,
      };
    })
    .sort((a, b) => a.statOrder - b.statOrder);

  const averageStats = [...teamStats]
    .filter((stat) => stat.valueType === "average")
    .sort((a, b) => a.statOrder - b.statOrder);

  return (
    <div>
      <div className="flex flex-col items-center my-4">
        <h1 className="text-center text-3xl text-(--primary) font-bold mb-2">
          Team Totals
        </h1>
        <div className="w-full justify-content-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {totalStats.map((stat) => (
            <TeamStatCard key={stat._id} stat={stat} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center my-4">
        <h1 className="text-center text-3xl text-(--primary) font-bold mb-2">
          Team Per Game Stats
        </h1>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {averageStats.map((stat) => (
            <TeamStatCard key={stat._id} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamLayout;
