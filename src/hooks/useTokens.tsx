"use client";

import { useState, useEffect } from 'react';

const useTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const cachedTokens = localStorage.getItem('tokens');
        if (cachedTokens) {
          setTokens(JSON.parse(cachedTokens));
          setLoading(false);
          return;
        }

        const response = await fetch('https://tokens.jup.ag/tokens?tags=verified');
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }
        const data = await response.json();
        setTokens(data);
        localStorage.setItem('tokens', JSON.stringify(data)); // Cache in localStorage
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return { tokens, loading, error };
};

export default useTokens;