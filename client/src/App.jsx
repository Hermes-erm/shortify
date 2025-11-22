import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Healthcheck from "./pages/Healthcheck.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import StatsEmpty from "./pages/StatsEmpty.jsx";

export default function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/healthz" element={<Healthcheck />} />
            <Route path="/code" element={<StatsEmpty />} />
            <Route path="/code/:code" element={<StatsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
