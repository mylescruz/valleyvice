import { signIn, useSession } from "next-auth/react";

const Footer = () => {
  const { data: session } = useSession();

  return (
    <div className="flex h-[10vh] w-full flex-row items-center justify-between bg-[(var(--secondary)] text-[var(--primary)]">
      {!session && (
        <p
          className="mx-4 mt-10 text-start text-[4px] cursor-pointer"
          onClick={() => signIn()}
        >
          VV
        </p>
      )}
      <p className="mx-4 my-2 text-end text-sm lg:mx-8 lg:text-lg">
        © Valley Vice 2025
      </p>
    </div>
  );
};

export default Footer;
