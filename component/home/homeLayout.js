import {
  faBasketball,
  faChartSimple,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const HomeLayout = () => {
  const sectionHeaderStyling = "text-xl font-bold mb-4";
  const iconStyling =
    "text-3xl text-(--primary) mt-4 mb-2 group-hover:text-(--foreground)";
  const linkDivStyling =
    "border-2 border-(--secondary) w-full my-4 rounded-lg px-2 p-1 flex flex-col sm:w-2/5 mx-4 lg:w-1/4 hover:bg-(--primary) group";

  return (
    <div className="flex flex-col items-center">
      <div className="w-11/12 sm:w-4/5 text-center">
        <h1 className="text-3xl lg:text-4xl text-(--primary) text-center font-bold">
          Valley Vice
        </h1>
        <p className="mt-4 text-lg">
          Welcome to the official site of the best men&#39;s rec league team in
          the Valley
        </p>
        <h2 className="mt-8 text-2xl text-(--primary) font-bold">Check out</h2>
        <div className="flex flex-col items-center md:flex-row lg:flex-wrap lg:justify-center my-3">
          <Link href={"/stats"} className={linkDivStyling}>
            <FontAwesomeIcon icon={faChartSimple} className={iconStyling} />
            <p className={sectionHeaderStyling}>Current stats</p>
          </Link>
          <Link href={"/seasons"} className={linkDivStyling}>
            <FontAwesomeIcon icon={faBasketball} className={iconStyling} />
            <p className={sectionHeaderStyling}>Current games</p>
          </Link>
          <Link href={"/roster"} className={linkDivStyling}>
            <FontAwesomeIcon icon={faUser} className={iconStyling} />
            <p className={sectionHeaderStyling}>Current roster</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;
