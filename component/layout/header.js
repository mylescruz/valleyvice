import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();

  const logo = {
    src: "/favicon.ico",
    alt: "Logo",
    width: 500,
    height: 500,
  };

  const pages = [
    { id: 0, link: "/stats", name: "Stats" },
    { id: 1, link: "/seasons", name: "Seasons" },
    { id: 2, link: "/roster", name: "Roster" },
  ];

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
        {session && (
          <p
            className="text-end mx-2 md:mx-6 font-bold text-lg lg:text-xl hover:text-[var(--secondary)] lg:mx-10 cursor-pointer"
            onClick={() => signOut()}
          >
            Logout
          </p>
        )}
      </div>
    </div>
  );
};

export default Header;
