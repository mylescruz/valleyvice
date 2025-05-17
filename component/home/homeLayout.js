import useSeason from "@/hooks/useSeason";
import Link from "next/link";
import LoadingIndicator from "../layout/loadingIndicator";

const HomeLayout = () => {
  const seasonNum = 18;

  const { season, seasonLoading } = useSeason(seasonNum);

  const pages = [
    { id: 0, link: `/stats/${seasonNum}`, name: "Stats" },
    { id: 1, link: `/seasons/${seasonNum}`, name: "Seasons" },
    // { id: 2, link: "/roster", name: "Roster" },
  ];

  if (seasonLoading) {
    return <LoadingIndicator />;
  } else {
    return (
      <div className="flex flex-col items-center">
        <div className="w-11/12 sm:w-4/5 text-center">
          <h1 className="text-3xl lg:text-5xl text-(--primary) text-center font-bold">
            Valley Vice
          </h1>
          <div className="flex flex-col items-center lg:flex-row lg:flex-wrap lg:justify-center my-3">
            <Link
              href={`/seasons/${season.seasonNumber}`}
              className="border-2 border-(--secondary) w-full my-4 rounded-lg px-2 p-1 flex flex-col sm:w-2/5 mx-4 sm:aspect-square md:aspect-auto lg:w-1/4"
            >
              <h1 className="text-3xl text-(--primary) font-bold">
                Season {season.seasonNumber}
              </h1>
              <p className="text-xl text-(--secondary) font-bold">
                Record: {season.wins} - {season.losses}
              </p>
              <p className="font-bold">
                {season.season} {season.year}
              </p>
              <p className="font-bold">
                {season.league} - {season.division}
              </p>
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default HomeLayout;
