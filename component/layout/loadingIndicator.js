import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball } from "@fortawesome/free-solid-svg-icons";

export default function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center h-[20vh] my-10">
      <FontAwesomeIcon
        icon={faBasketball}
        className="text-(--primary) text-5xl text-center animate-spin duration-500"
      />
    </div>
  );
}
