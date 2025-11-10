import { useEffect, useState } from "react";

const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const response = await fetch("/api/analytics");

        if (response.ok) {
          const result = await response.json();
          setAnalytics(result);
        } else {
          const message = await response.text();
          throw new Error(message);
        }
      } catch (error) {
        setAnalytics(null);
        console.error(error);
      } finally {
        setAnalyticsLoading(false);
      }
    };

    getAnalytics();
  }, []);

  return { analytics, analyticsLoading };
};

export default useAnalytics;
