import React, { useState } from "react";

function InputField({
  type,
  label,
  placeholder,
  value,
  onChange,
  required = true,
}) {
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    onChange(e);
    setIsValid(e.target.value.trim().length > 0);
  };

  return (
    <div>
      {label && <label>{label}</label>}
      <input
        type={type}
        className={`form-control form-control-lg${
          isValid
            ? "form-control form-control-lg is-valid"
            : "form-control form-control-lg is-invalid"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
}

export default InputField;
