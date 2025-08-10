import { faBasketball } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn, useSession } from "next-auth/react";

const footerTextStyling = "mx-4 my-2 text-sm lg:mx-8 lg:text-lg";
const iconStyling =
  "text-sm text-(--primary) mt-4 mb-2 group-hover:text-(--foreground)";

const Footer = () => {
  const { data: session } = useSession();

  return (
    <div className="flex h-[10vh] w-full flex-row items-center justify-between bg-[(var(--secondary)] text-[var(--primary)]">
      {!session && (
        <p className={footerTextStyling} onClick={() => signIn()}>
          <FontAwesomeIcon icon={faBasketball} className={iconStyling} />
        </p>
      )}
      <p className={footerTextStyling}>© Valley Vice 2025</p>
    </div>
  );
};

export default Footer;
