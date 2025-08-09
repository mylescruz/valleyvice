import { useCallback, useEffect, useState } from "react";

const useTrackedGame = () => {
  const [trackedGame, setTrackedGame] = useState({});
  const [trackedGameLoading, setTrackedGameLoading] = useState(true);

  useEffect(() => {
    const getTrackedGame = async () => {
      try {
        const response = await fetch("/api/trackedGame");

        if (response.ok) {
          const result = await response.json();
          setTrackedGame(result);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        setTrackedGame(null);
        console.error(error);
      } finally {
        setTrackedGameLoading(false);
      }
    };

    getTrackedGame();
  }, []);

  const postTrackedGame = useCallback(async (game) => {
    try {
      const response = await fetch("/api/trackedGame", {
        method: "POST",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(game),
      });

      if (response.ok) {
        const result = await response.json();
        setTrackedGame(result);
      } else {
        const result = await response.text();
        throw new Error(result);
      }
    } catch (error) {
      setTrackedGame(null);
      console.error(error);
    } finally {
      setTrackedGameLoading(false);
    }
  }, []);

  const deleteTrackedGame = useCallback(async () => {
    try {
      const response = await fetch("/api/trackedGame", {
        method: "DELETE",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setTrackedGame(result);
      } else {
        const result = await response.text();
        throw new Error(result);
      }
    } catch (error) {
      setTrackedGame(null);
      console.error(error);
    } finally {
      setTrackedGameLoading(false);
    }
  }, []);

  return {
    trackedGame,
    trackedGameLoading,
    postTrackedGame,
    deleteTrackedGame,
  };
};

export default useTrackedGame;
