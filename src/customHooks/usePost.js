import { useState } from "react";
import axios from "axios";

export default function usePost(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (payload, config = { withCredentials: true }) => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.post(url, payload, config);
      setData(res.data);
      return res.data;
    } catch (err) {
      console.error(`ERROR IN POST REQUEST TO ${url}`, err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, postData };
}
