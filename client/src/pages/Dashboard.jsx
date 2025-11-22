import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useToast } from "../context/toastContext";
import Modal from "react-bootstrap/Modal";

const API = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCode, setDeleteCode] = useState(null);

  const openDeleteModal = (code) => {
    setDeleteCode(code);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteCode(null);
  };

  const itemsPerPage = 5;

  const [inputUrl, setInputUrl] = useState("");
  const [inputCode, setInputCode] = useState("");

  const { showToast } = useToast();

  const [links, setLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API}/api/links`)
      .then((res) => res.json())
      .then((data) => setLinks(data));
  }, []);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = links.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(links.length / itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleRedirect = async (code) => {
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
      <h2>Dashboard</h2>

      <table className="table table-striped mt-4">
        <thead>
          <tr>
            <th>Short Code</th>
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
                  maxWidth: "250px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {link.url}
              </td>

              <td>{link.total_clicks}</td>
              <td>{formatDateShort(link.last_clicked) || "Never"}</td>
              <td>
                <Link to={`/code/${link.code}`} className="btn btn-sm btn-primary me-2">
                  Stats
                </Link>

                <button className="btn btn-sm btn-danger" onClick={() => openDeleteModal(link.code)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination UI */}
      <nav>
        <ul className="pagination">
          {/* Prev button */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => changePage(currentPage - 1)}>
              Previous
            </button>
          </li>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => changePage(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}

          {/* Next button */}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => changePage(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      <div style={{ maxWidth: "400px" }} className="mx-auto">
        {/* URL Input */}
        <InputGroup className="mb-2">
          <Form.Control
            placeholder="https://example.com/my-long-url"
            aria-label="sample-url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
          />
        </InputGroup>

        {/* Optional Code Input */}
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Optional custom code (ex: mylink123)"
            aria-label="custom-code"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
          />
        </InputGroup>

        {/* Button full width */}
        <div className="d-grid">
          <Button variant="primary" size="md" onClick={createLink}>
            Create Link
          </Button>
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
