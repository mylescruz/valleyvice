import { InfoContext } from "@/contexts/InfoContext";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const Header = () => {
  const { info, infoLoading } = useContext(InfoContext);
  const [seasonNumber, setSeasonNumber] = useState("");

  useEffect(() => {
    if (!infoLoading && info) {
      setSeasonNumber(info.currentSeason);
    }
  }, [info, infoLoading]);

  const logo = {
    src: "/favicon.ico",
    alt: "Logo",
    width: 500,
    height: 500,
  };

  const pages = [
    { id: 0, link: `/stats/${seasonNumber}`, name: "Stats" },
    { id: 1, link: `/seasons/${seasonNumber}`, name: "Seasons" },
    { id: 2, link: `/roster/${seasonNumber}`, name: "Roster" },
  ];

  if (infoLoading) {
    return <></>;
  } else {
    return (
      <div className="w-full bg-[var(--tertiary)] p-1 text-start text-[var(--primary)]">
        <div className="flex w-full flex-row items-center">
          <div className="m-2">
            <Link href="/">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="w-[50px] md:w-[60px] lg:w-[75px] aspect-square"
              />
            </Link>
          </div>
          <div>
            {pages.map((page) => (
              <Link
                key={page.id}
                href={page.link}
                className="mx-2 md:mx-6 font-bold text-lg lg:text-xl hover:text-[var(--secondary)] lg:mx-10"
              >
                {page.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default Header;
