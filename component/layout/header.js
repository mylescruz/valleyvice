import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const linkStyling =
  "mx-2 md:mx-6 font-bold text-lg lg:text-xl hover:text-[var(--secondary)] lg:mx-10";

const Header = () => {
  const { data: session } = useSession();

  const logo = {
    src: "/favicon.ico",
    alt: "Logo",
    width: 500,
    height: 500,
  };

  const pages = [
    { name: "Stats", link: "/stats", adminPage: false },
    { name: "Seasons", link: "/seasons", adminPage: false },
    { name: "Roster", link: "/roster", adminPage: false },
    { name: "Tracker", link: "/tracker", adminPage: true },
    { name: "Info", link: "/info", adminPage: true },
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
          {pages.map((page, index) =>
            session ? (
              <Link key={index} href={page.link} className={linkStyling}>
                {page.name}
              </Link>
            ) : (
              !page.adminPage && (
                <Link key={index} href={page.link} className={linkStyling}>
                  {page.name}
                </Link>
              )
            )
          )}
          {session && (
            <Link className={linkStyling} href="/" onClick={() => signOut()}>
              Logout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
