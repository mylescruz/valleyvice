import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const logo = {
    src: "/favicon.ico",
    alt: "Logo",
    width: 500,
    height: 500,
  };

  const pages = [
    { id: 0, link: "/current", name: "Stats" },
    { id: 1, link: "/seaons", name: "Seasons" },
    { id: 2, link: "/roster", name: "Roster" },
  ];

  return (
    <div className="w-full bg-[var(--tertiary)] p-1 text-start text-[var(--primary)] h-[10vh]">
      <div className="flex w-full flex-row items-center">
        <div className="m-3">
          <Link href="/">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="w-[50px] aspect-square"
            />
          </Link>
        </div>
        <div>
          {pages.map((page) => (
            <Link
              key={page.id}
              href={page.link}
              className="mx-2 font-bold lg:text-xl hover:text-[var(--secondary)]"
            >
              {page.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
