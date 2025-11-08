import { useCallback, useEffect, useState } from "react";

const useRoster = (seasonNumber) => {
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(true);

  useEffect(() => {
    const getRoster = async () => {
      try {
        const response = await fetch(`/api/roster/${seasonNumber}`);

        if (response.ok) {
          const result = await response.json();
          setRoster(result);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        setRoster(null);
        console.error(error);
      } finally {
        setRosterLoading(false);
      }
    };

    getRoster();
  }, [seasonNumber]);

  return { roster, rosterLoading };
};

export default useRoster;
