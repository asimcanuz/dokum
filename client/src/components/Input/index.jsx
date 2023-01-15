import React from "react";
import styles from "./Input.module.css";

function Input({ type, placeholder, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={styles.inputs}
      {...props}
    />
  );
}

export default Input;
