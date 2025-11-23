import Spinner from "react-bootstrap/Spinner";

export default function Loader({ height = "50vh" }) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height }}>
      <Spinner animation="border" role="status" />
    </div>
  );
}
