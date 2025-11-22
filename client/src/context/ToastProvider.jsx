import { useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { ToastContext } from "./toastContext";

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          bg={toast.type === "error" ? "danger" : toast.type}
          show={toast.show}
          onClose={hideToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
}
