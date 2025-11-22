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
      <h2>Healthcheck</h2>

      {/* {health ? <pre className="mt-3 bg-light p-3 rounded">{JSON.stringify(health, null, 2)}</pre> : <p>Loading...</p>} */}
      {health ? (
        <div className="mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">System Health</h5>

              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between">
                  <strong>Status:</strong>
                  <span className={health.ok ? "text-success" : "text-danger"}>
                    {health.ok ? "Server up" : "Server status not found"}
                  </span>
                </li>

                <li className="list-group-item d-flex justify-content-between">
                  <strong>Total link created:</strong>
                  <span>{health.totalLinkCreated}</span>
                </li>

                <li className="list-group-item d-flex justify-content-between">
                  <strong>Total Clicks:</strong>
                  <span>{health.totalClick}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
