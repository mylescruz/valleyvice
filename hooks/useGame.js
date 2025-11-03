import { useEffect, useState } from "react";

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

  return { game, gameLoading };
};

export default useGame;
