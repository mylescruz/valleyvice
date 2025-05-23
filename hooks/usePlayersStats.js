const usePlayerStats = (seasonNumber) => {
  const putPlayersStats = async (playerStats) => {
    try {
      const response = await fetch(`/api/playersStats/${seasonNumber}`, {
        method: "PUT",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerStats),
      });

      if (response.ok) {
        const result = await response.text();
        console.log(result);
      } else {
        const result = await response.text();
        throw new Error(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { putPlayersStats };
};

export default usePlayerStats;
