import { useState, useEffect, useCallback } from 'react';
import api, { errMsg } from '../api/axios';

// const { data, loading, error, refetch } = useFetch('/recipes', { page: 1 })
export const useFetch = (url, params = {}, { skip = false } = {}) => {
  const [state, setState] = useState({ data: null, loading: !skip, error: null });
  const [tick, setTick] = useState(0);
  const key = JSON.stringify(params); // ổn định để làm dependency

  useEffect(() => {
    if (skip || !url) return undefined;
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get(url, { params: JSON.parse(key), signal: controller.signal })
      .then((res) => setState({ data: res.data, loading: false, error: null }))
      .catch((err) => {
        if (err.name === 'CanceledError') return;
        setState({ data: null, loading: false, error: errMsg(err) });
      });
    return () => controller.abort(); // cleanup: hủy request cũ
  }, [url, key, skip, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, refetch };
};
