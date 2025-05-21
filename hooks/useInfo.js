import { useEffect, useState } from "react";

const useInfo = () => {
  const [info, setInfo] = useState({});
  const [infoLoading, setInfoLoading] = useState(true);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await fetch(`/api/info`);

        if (response.ok) {
          const result = await response.json();
          setInfo(result);
          setInfoLoading(false);
        } else {
          const result = await response.text();
          throw new Error(result);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getInfo();
  }, []);

  return { info, infoLoading };
};

export default useInfo;
