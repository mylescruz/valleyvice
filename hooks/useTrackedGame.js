import { useEffect, useState } from "react";

const useTrackedGame = () => {
  const [trackedGame, setTrackedGame] = useState({});
  const [trackedGameLoading, setTrackedGameLoading] = useState(true);

  useEffect(() => {
    const getTrackedGame = async () => {
      try {
        const response = await fetch(`/api/trackedGame`);

        if (response.ok) {
          const result = await response.json();
          setTrackedGame(result);
          setTrackedGameLoading(false);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getTrackedGame();
  }, []);

  return { trackedGame, trackedGameLoading };
};

export default useTrackedGame;
