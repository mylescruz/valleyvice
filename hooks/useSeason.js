import { useEffect, useState } from "react";

const useSeason = (seasonNumber) => {
  const [season, setSeason] = useState({});
  const [seasonLoading, setSeasonLoading] = useState(true);

  useEffect(() => {
    const getSeason = async () => {
      try {
        const response = await fetch(`/api/season/${seasonNumber}`);

        if (response.ok) {
          const result = await response.json();
          setSeason(result);
          setSeasonLoading(false);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getSeason();
  }, [seasonNumber]);

  const putSeason = async (season) => {
    try {
      const response = await fetch(`/api/season/${season.seasonNumber}`, {
        method: "PUT",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(season),
      });

      if (response.ok) {
        const result = await response.json();
        setSeason(result);
        setSeasonLoading(false);
      } else {
        const result = await response.text();
        throw new Error(result);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { season, seasonLoading, putSeason };
};

export default useSeason;
