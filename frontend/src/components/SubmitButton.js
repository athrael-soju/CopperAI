import React from "react";

function SubmitButton({ type, children, onClick }) {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export default SubmitButton;
