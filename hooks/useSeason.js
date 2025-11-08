import { useCallback, useEffect, useState } from "react";

const useSeason = (seasonNumber) => {
  const [season, setSeason] = useState(null);
  const [seasonLoading, setSeasonLoading] = useState(true);

  useEffect(() => {
    const getSeason = async () => {
      try {
        const response = await fetch(`/api/season/${seasonNumber}`);

        if (response.ok) {
          const result = await response.json();
          setSeason(result);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        setSeason(null);
        console.error(error);
      } finally {
        setSeasonLoading(false);
      }
    };

    getSeason();
  }, [seasonNumber]);

  const postSeason = useCallback(async (newSeason) => {
    try {
      const response = await fetch(`/api/season/${newSeason.seasonNumber}`, {
        method: "POST",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSeason),
      });

      if (response.ok) {
        const result = await response.json();
        setSeason(result);
      } else {
        const result = await response.text();
        throw new Error(result);
      }
    } catch (error) {
      setSeason(null);
      console.error(error);
    } finally {
      setSeasonLoading(false);
    }
  }, []);

  return { season, seasonLoading, postSeason };
};

export default useSeason;
