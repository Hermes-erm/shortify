import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const linkClass = (path) => "nav-link text-white " + (pathname === path ? "bg-primary" : "");

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
      style={{ width: "240px", minHeight: "100vh" }}
    >
      <span className="fs-4 mb-4">Shortify</span>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <Link to="/" className={linkClass("/")}>
            Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link to="/healthz" className={linkClass("/healthz")}>
            Healthcheck
          </Link>
        </li>

        <Link to="/code" className={linkClass("/code")}>
          Stats
        </Link>
      </ul>
    </div>
  );
}
