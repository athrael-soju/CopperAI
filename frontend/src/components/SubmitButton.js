import React from "react";
import styles from "../styles/SubmitButton.module.css";

function SubmitButton({ type, children, onClick }) {
  return (
    <button className={styles.submitButton} 
    type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export default SubmitButton;
