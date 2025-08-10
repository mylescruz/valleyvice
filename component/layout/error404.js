import Link from "next/link";

const buttonStyling =
  "bg-(--secondary) font-bold rounded-lg ml-4 px-2 py-1 hover:bg-(--primary) hover:cursor-pointer";

export default function Error404() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-11/12 sm:w-4/5">
        <div className="flex flex-col mt-2 mb-4 text-center">
          <p className="mb-8">Whoops! This page does not exist!</p>
          <Link href="/">
            <button className={buttonStyling}>Back to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
