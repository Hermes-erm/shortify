import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function StatsPage() {
  const { code } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/links/${code}`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [code]);

  console.log(code);

  return (
    <div>
      <h2>Stats for: {code}</h2>

      {data ? (
        <div className="mt-3">
          <p>
            <strong>URL:</strong> {data.url}
          </p>
          <p>
            <strong>Total Clicks:</strong> {data.total_clicks}
          </p>
          <p>
            <strong>Last Clicked:</strong> {data.last_clicked || "Never"}
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
