import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { toast } from "../services/notify";

// Fetch a list endpoint with optional query params; returns { rows, loading, reload, setRows }.
export function useList(endpoint, params = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const key = JSON.stringify(params);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoint, { params });
      if (res.data?.success) setRows(res.data.data || []);
    } catch (e) {
      toast(e.response?.data?.message || `Failed to load data.`, "error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, key]);

  useEffect(() => { reload(); }, [reload]);
  return { rows, loading, reload, setRows };
}

// Fetch a single object endpoint (e.g. dashboard aggregates).
export function useData(endpoint, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(endpoint);
      if (res.data?.success) setData(res.data.data);
    } catch {
      /* handled silently; page shows empty states */
    } finally { setLoading(false); }
  }, [endpoint]);
  useEffect(() => { reload(); /* eslint-disable-next-line */ }, deps);
  return { data, loading, reload };
}

// Helpers for mutations with toast feedback.
export async function save(method, url, body) {
  try {
    const res = await api[method](url, body);
    if (res.data?.success) { toast(res.data.message || "Saved.", "success"); return true; }
    toast(res.data?.message || "Something went wrong.", "error");
    return false;
  } catch (e) {
    toast(e.response?.data?.message || "Request failed.", "error");
    return false;
  }
}
