const TeamStatCard = ({ stat }) => {
  return (
    <div className="border-2 border-(--secondary) rounded-lg m-2 px-2 py-4">
      <div className="flex flex-col items-center text-center font-bold">
        <h1 className="text-(--primary) text-2xl">{stat.title}</h1>
        <h6 className="text-lg">{stat.value}</h6>
      </div>
    </div>
  );
};

export default TeamStatCard;
