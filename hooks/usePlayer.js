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

  const putPlayer = async (player) => {
    try {
      const response = await fetch(`/api/player/${player.playerId}`, {
        method: "PUT",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(player),
      });

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

  return { player, playerLoading, putPlayer };
};

export default usePlayer;
