import React from "react";
import styles from "../styles/InputField.module.css";

function InputField({ type, placeholder, value, onChange }) {
  return (
    <input
      className={styles.inputField}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default InputField;
