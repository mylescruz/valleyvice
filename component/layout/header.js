import { faBars, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Logo from "./logo";

const linkStyling =
  "mx-2 md:mx-6 font-bold text-lg lg:text-xl hover:text-[var(--secondary)] lg:mx-10";
const mobileLinkStyling = "mx-4 my-1 font-bold text-lg";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState(false);

  const pages = [
    { name: "Stats", link: "/stats", adminPage: false },
    { name: "Seasons", link: "/seasons", adminPage: false },
    { name: "Roster", link: "/roster", adminPage: false },
    { name: "Tracker", link: "/tracker", adminPage: true },
    { name: "Info", link: "/info", adminPage: true },
  ];

  const userSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const closeMenu = () => {
    setOpenMenu(false);

    router.push("/");
  };

  return (
    <>
      <div className="w-full bg-[var(--tertiary)] p-1 text-start text-[var(--primary)] border-b-1 border-b-(--secondary) sm:border-0">
        <div className="flex w-full flex-row justify-between items-center sm:hidden my-2">
          <div className="flex-1 text-xl">
            {!openMenu ? (
              <FontAwesomeIcon
                icon={faBars}
                className="mx-4"
                onClick={toggleMenu}
              />
            ) : (
              <FontAwesomeIcon
                icon={faX}
                className="mx-4"
                onClick={toggleMenu}
              />
            )}
          </div>
          <div
            className="flex-1 items-center justify-center justify-items-center"
            onClick={closeMenu}
          >
            <Logo />
          </div>
          <div className="flex-1"></div>
        </div>
        <div className="hidden sm:flex sm:w-full sm:items-center">
          <div className="m-4">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="">
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
              <Link className={linkStyling} href="/" onClick={userSignOut}>
                Logout
              </Link>
            )}
          </div>
        </div>
      </div>

      {openMenu && (
        <div className="flex flex-col w-full bg-(--tertiary) mb-4 p-1 text-start text-[var(--primary)] border-b-1 border-b-(--secondary)">
          {pages.map((page, index) =>
            session ? (
              <Link
                key={index}
                href={page.link}
                className={mobileLinkStyling}
                onClick={toggleMenu}
              >
                {page.name}
              </Link>
            ) : (
              !page.adminPage && (
                <Link
                  key={index}
                  href={page.link}
                  className={mobileLinkStyling}
                  onClick={toggleMenu}
                >
                  {page.name}
                </Link>
              )
            )
          )}
          {session && (
            <Link className={mobileLinkStyling} href="/" onClick={userSignOut}>
              Logout
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
