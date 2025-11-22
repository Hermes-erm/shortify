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

  function formatDateShort(dateString) {
    if (!dateString) return "Never";

    const d = new Date(dateString);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  console.log(code);

  return (
    <div>
      <h4 className="mb-2">Stats for: {code}</h4>

      {data ? (
        <div className="card shadow-sm rounded-4 my-3" style={{ maxWidth: "500px" }}>
          <div className="card-body p-3">
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between py-2">
                <strong>URL:</strong>
                <span
                  style={{
                    maxWidth: "250px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "right",
                  }}
                  title={data.url}
                >
                  {data.url}
                </span>
              </li>

              <li className="list-group-item d-flex justify-content-between py-2">
                <strong>Total Clicks:</strong>
                <span>{data.total_clicks}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between py-2">
                <strong>Last Clicked:</strong>
                <span>{formatDateShort(data.last_clicked) || "Never"}</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
