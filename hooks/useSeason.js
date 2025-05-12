import { useEffect, useState } from "react";

const useSeason = (seasonNum) => {
  const [season, setSeason] = useState({});
  const [seasonLoading, setSeasonLoading] = useState(true);

  useEffect(() => {
    const getSeason = async () => {
      try {
        const response = await fetch(`/api/season/${seasonNum}`);

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
  }, [seasonNum]);

  return { season, seasonLoading };
};

export default useSeason;
