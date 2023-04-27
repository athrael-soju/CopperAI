import React from "react";

function InputField({
  type,
  label,
  placeholder,
  value,
  onChange,
  required = true,
}) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        type={type}
        className="form-control form-control-lg"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export default InputField;
