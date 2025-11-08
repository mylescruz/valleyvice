import { useEffect, useState } from "react";

const usePlayer = (playerId) => {
  const [player, setPlayer] = useState({});
  const [playerLoading, setPlayerLoading] = useState(true);

  useEffect(() => {
    const getPlayer = async () => {
      try {
        const response = await fetch(`/api/player/${playerId}`);

        if (response.ok) {
          const result = await response.json();
          setPlayer(result);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        setPlayer(null);
        console.error(error);
      } finally {
        setPlayerLoading(false);
      }
    };

    getPlayer();
  }, [playerId]);

  return { player, playerLoading };
};

export default usePlayer;
