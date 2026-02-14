import Image from "next/image";

const LeadersCard = ({ stat }) => {
  return (
    <div className="border-2 border-(--secondary) rounded-lg m-2 px-4 py-4">
      <div className="flex flex-col items-center text-center font-bold">
        <h1 className="text-white text-2xl">{stat.statKey}</h1>
        <Image
          src={`/images/${stat.imageSrc}`}
          alt={stat.imageAlt}
          height={100}
          width={100}
          className="rounded-full shadow shadow-gray-500"
        />
        <h3 className="text-(--primary) text-xl">{stat.name}</h3>
        <h6 className="text-lg">{stat.value}</h6>
      </div>
    </div>
  );
};

export default LeadersCard;
