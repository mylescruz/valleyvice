import { useEffect, useState } from "react";

const useRoster = () => {
  const [roster, setRoster] = useState({});
  const [rosterLoading, setRosterLoading] = useState(true);

  useEffect(() => {
    const getRoster = async () => {
      try {
        const response = await fetch(`/api/roster`);

        if (response.ok) {
          const result = await response.json();
          setRoster(result);
          setRosterLoading(false);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getRoster();
  }, []);

  return { roster, rosterLoading };
};

export default useRoster;
