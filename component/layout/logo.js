import Image from "next/image";

export default function Logo() {
  const logo = {
    src: "/favicon.ico",
    alt: "Logo",
    width: 500,
    height: 500,
  };

  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      className="w-[50px] md:w-[60px] lg:w-[75px] aspect-square"
    />
  );
}
