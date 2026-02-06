import { useCallback, useEffect, useState } from "react";

const useGame = (seasonNumber, gameNumber) => {
  const [game, setGame] = useState(null);
  const [gameLoading, setGameLoading] = useState(true);

  useEffect(() => {
    const getGame = async () => {
      try {
        const response = await fetch(`/api/game/${seasonNumber}/${gameNumber}`);

        if (response.ok) {
          const result = await response.json();
          setGame(result);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        setGame(null);
        console.error(error);
      } finally {
        setGameLoading(false);
      }
    };

    getGame();
  }, [seasonNumber, gameNumber]);

  const putGame = useCallback(
    async (editedGame) => {
      try {
        const response = await fetch(
          `/api/game/${seasonNumber}/${gameNumber}`,
          {
            method: "PUT",
            headers: {
              Accept: "application.json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedGame),
          },
        );

        if (response.ok) {
          const updatedGame = await response.json();
          setGame(updatedGame);
        } else {
          const error = await response.text();
          throw new Error(error);
        }
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    },
    [seasonNumber, gameNumber],
  );

  return { game, gameLoading, putGame };
};

export default useGame;
