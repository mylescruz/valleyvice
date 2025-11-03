import { useState, useEffect } from "react";

const useSeasonStats = (seasonNumber) => {
  const [seasonStats, setSeasonStats] = useState(null);
  const [seasonStatsLoading, setSeasonStatsLoading] = useState(true);

  useEffect(() => {
    const getSeasonStats = async (seasonNumber) => {
      try {
        const response = await fetch(`api/stats/${seasonNumber}`);

        if (response.ok) {
          const result = await response.json();
          setSeasonStats(result);
        }
      } catch (error) {
        setStats(null);
        console.error(error);
      } finally {
        setSeasonStatsLoading(false);
      }
    };

    getSeasonStats(seasonNumber);
  }, [seasonNumber]);

  return { seasonStats, seasonStatsLoading };
};

export default useSeasonStats;
