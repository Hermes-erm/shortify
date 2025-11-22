import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Healthcheck() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/healthz`)
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ error: true }));
  }, []);

  return (
    <div>
      <h2>Healthcheck</h2>

      {health ? <pre className="mt-3 bg-light p-3 rounded">{JSON.stringify(health, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
