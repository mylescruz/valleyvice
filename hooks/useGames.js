import { useCallback } from "react";

const useGames = () => {
  const postGame = useCallback(async (game) => {
    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(game),
      });

      if (!response.ok) {
        const result = await response.text();
        throw new Error(result);
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }, []);

  return { postGame };
};

export default useGames;
