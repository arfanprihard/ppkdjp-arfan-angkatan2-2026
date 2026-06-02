import { useState, useEffect, useCallback } from "react";

const useFetch = (fetchServiceFn) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchServiceFn();
      setData(result.data || result);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }, [fetchServiceFn]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refetch: loadData };
};

export default useFetch;
