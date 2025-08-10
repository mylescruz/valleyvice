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

  const postRoster = useCallback(async (seasonInfo) => {
    try {
      const response = await fetch(`/api/roster/${seasonInfo.seasonNumber}`, {
        method: "POST",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seasonInfo),
      });

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
  }, []);

  const putRoster = useCallback(
    async (roster) => {
      try {
        const response = await fetch(`/api/roster/${seasonNumber}`, {
          method: "PUT",
          headers: {
            Accept: "application.json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(roster),
        });

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
    },
    [seasonNumber]
  );

  return { roster, rosterLoading, postRoster, putRoster };
};

export default useRoster;
