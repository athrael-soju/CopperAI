import React from "react";

function SubmitButton({ type, children, onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="submit-buttons btn btn-outline-dark"
    >
      {children}
    </button>
  );
}

export default SubmitButton;
