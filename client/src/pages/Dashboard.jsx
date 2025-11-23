import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useToast } from "../context/toastContext";
import Modal from "react-bootstrap/Modal";
import Loader from "../components/Loader";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const itemsPerPage = 5;

  const [inputUrl, setInputUrl] = useState("");
  const [inputCode, setInputCode] = useState("");

  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCode, setDeleteCode] = useState(null);

  const { showToast } = useToast();

  const openDeleteModal = (code) => {
    setDeleteCode(code);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteCode(null);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API}/api/links`);

        if (!res.ok) throw new Error("Server error");

        const data = await res.json();
        setLinks(data);
      } catch {
        showToast("Failed to load links", "error");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <Loader />;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = links.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(links.length / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleRedirect = async (code) => {
    setLinks((prev) =>
      prev.map((link) => (link.code === code ? { ...link, total_clicks: link.total_clicks + 1 } : link))
    );
    window.open(`${API}/api/${code}`, "_blank");
  };

  const createLink = async () => {
    if (!inputUrl.trim()) {
      showToast("Please enter a URL", "warning");
      return;
    }

    try {
      const res = await fetch(`${API}/api/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: inputUrl,
          code: inputCode || undefined, // send only if provided
        }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok && data.message) {
        showToast(data.message, "error");
        return;
      }

      data.total_clicks = 0;
      setLinks((prev) => [data, ...prev]);

      setInputUrl("");
      setInputCode("");
    } catch (err) {
      console.error(err);
      showToast("Network error occurred", "error");
    }
  };

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

  const truncate = (str, max = 50) => (str.length > max ? str.slice(0, max) + "..." : str);

  const deleteLink = async () => {
    try {
      const res = await fetch(`${API}/api/links/${deleteCode}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to delete", "error");
        return;
      }

      // Remove from table
      setLinks((prev) => prev.filter((l) => l.code !== deleteCode));

      showToast("Link deleted successfully!", "success");

      closeDeleteModal();
    } catch (err) {
      console.error(err);
      showToast("Network error", "error");
    }
  };

  return (
    <div>
      {/* <h3>Dashboard</h3> */}
      <h4 className="mb-2">Dashboard</h4>

      <div className="card shadow-sm rounded-4 my-3">
        <div className="card-body">
          {/* <h4 className="card-title mb-3">Content of links</h4> */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>URL Code</th>
                  <th>URL</th>
                  <th>Total Clicks</th>
                  <th>Last Clicked</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((link) => (
                  <tr key={link.code}>
                    <td style={{ cursor: "pointer", color: "#0d6efd" }} onClick={() => handleRedirect(link.code)}>
                      {link.code}
                    </td>

                    <td
                      title={link.url}
                      style={{
                        maxWidth: "260px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {truncate(link.url, 40)}
                    </td>

                    <td>{link.total_clicks}</td>
                    <td>{formatDateShort(link.last_clicked)}</td>
                    <td>
                      <Link to={`/code/${link.code}`} className="btn btn-outline-primary btn-sm me-2">
                        Stats
                      </Link>

                      <button className="btn btn-outline-danger btn-sm" onClick={() => openDeleteModal(link.code)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-2">
        <div className="row align-items-start">
          {/* LEFT: FORM */}
          <div className="col-md-4 col-sm-12 p-0">
            <div className="card shadow-sm rounded-4 p-3 mx-0">
              <h5 className="mb-3">Create New Short Link</h5>

              <InputGroup className="mb-2">
                <Form.Control
                  placeholder="https://example.com"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
              </InputGroup>

              <InputGroup className="mb-2">
                <Form.Control
                  placeholder="Optional custom code"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
              </InputGroup>

              <div className="d-grid">
                <Button variant="primary" className="rounded-pill" onClick={createLink}>
                  Create Link
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT: Pagination */}
          <div className="col-md-8 col-sm-12 d-flex justify-content-end">
            <nav>
              <ul className="pagination pagination-sm">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => changePage(currentPage - 1)}>
                    Previous
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => changePage(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => changePage(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Link</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete the link:
          <br />
          <strong>{deleteCode}</strong>?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>

          <Button variant="danger" onClick={deleteLink}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
