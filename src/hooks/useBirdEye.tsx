import { useState, useEffect } from "react";

const BIRDEYE_API_KEY = "YOUR_BIRDEYE_API_KEY";
const BASE_URL = "https://api.birdeye.so";

const useBirdeye = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = new URL(`${BASE_URL}/${endpoint}`);
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );

        const response = await fetch(url, {
          headers: { "X-API-KEY": BIRDEYE_API_KEY },
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
};

export default useBirdeye;
