import React from "react";

function InputField({ type, label, placeholder, value, onChange }) {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default InputField;
