const LeadersCard = ({ stat }) => {
  return (
    <div className="border-2 border-(--secondary) rounded-lg m-2 px-4 py-4">
      <div className="text-center font-bold">
        <h1 className="text-white text-2xl">{stat.stat}</h1>
        <h3 className="text-(--primary) text-xl">{stat.name}</h3>
        <h6 className="text-lg">{stat.value}</h6>
      </div>
    </div>
  );
};

export default LeadersCard;
