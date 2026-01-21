import { useRouter } from "next/navigation";

const cancelButtonStyling =
  "font-bold rounded-lg mx-2 px-2 py-1 bg-gray-500 hover:bg-(--primary) hover:cursor-pointer";
const confirmButtonStyling =
  "font-bold rounded-lg mx-2 px-2 py-1 bg-(--secondary) hover:bg-(--primary) hover:cursor-pointer";

const ConfirmRestartModal = ({ setRestartModal, deleteTrackedGame }) => {
  const router = useRouter();

  const cancelRestart = () => {
    setRestartModal(false);
  };

  const confirmRestart = async () => {
    await deleteTrackedGame();

    router.refresh();
  };

  return (
    <div className="fixed top-0 left-0 w-[100%] h-[100%] bg-[rgba(255,255,255,0.2)] z-50 flex flex-col justify-center items-center">
      <div className="w-11/12 sm:w-2/3 md:w-3/5 lg:w-2/5 xl:w-2/7  bg-(--background) p-4 rounded-lg flex flex-col h-30 justify-between">
        <h1 className="text-center font-bold">
          Are you sure you want to start over?
        </h1>
        <div className="flex flex-row justify-between">
          <button className={cancelButtonStyling} onClick={cancelRestart}>
            Cancel
          </button>
          <button className={confirmButtonStyling} onClick={confirmRestart}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmRestartModal;
