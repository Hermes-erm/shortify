import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Healthcheck() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/healthz`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({}));
  }, []);

  return (
    <div>
      <h4 className="mb-2">Healthcheck</h4>

      {health ? (
        <div className="card shadow-sm rounded-4 my-3" style={{ maxWidth: "500px" }}>
          <div className="card-body p-3">
            <h5 className="card-title mb-3">System Health</h5>

            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between py-2">
                <strong>Status:</strong>
                <span className={health.ok ? "text-success" : "text-danger"}>
                  {health.ok ? "Server Up" : "Server Down"}
                </span>
              </li>

              <li className="list-group-item d-flex justify-content-between py-2">
                <strong>Total Links Created:</strong>
                <span>{health.totalLinkCreated}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between py-2">
                <strong>Total Clicks:</strong>
                <span>{health.totalClick}</span>
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
