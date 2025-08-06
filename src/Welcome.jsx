import axios from "axios";
import { useEffect, useState } from "react";

const Welcome = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("FROM ",token)

        const res = await axios.get("http://localhost:8080/welcome", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
        setError(false);
      } catch (err) {
        console.error("error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data.</div>;

  return <div>{data}</div>;
};

export default Welcome;
