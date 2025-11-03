import { useCallback, useEffect, useState } from "react";

const useInfo = () => {
  const [info, setInfo] = useState({});
  const [infoLoading, setInfoLoading] = useState(true);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await fetch("/api/info");

        if (response.ok) {
          const result = await response.json();
          setInfo(result);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        setInfo(null);
        console.error(error);
      } finally {
        setInfoLoading(false);
      }
    };

    getInfo();
  }, []);

  const putInfo = useCallback(async (updatedInfo) => {
    try {
      const response = await fetch("/api/info", {
        method: "PUT",
        headers: {
          Accept: "application.json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedInfo),
      });

      if (response.ok) {
        const result = await response.json();
        setInfo(result);
      } else {
        const result = await response.text();
        throw new Error(result);
      }
    } catch (error) {
      setInfo(null);
      console.error(error);
    } finally {
      setInfoLoading(false);
    }
  }, []);

  return { info, infoLoading, putInfo };
};

export default useInfo;
