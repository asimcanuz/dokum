import React from "react";
import styles from "./Input.module.css";
function CheckBox({ id, label, ...props }) {
  return (
    <div className={styles.formGroup}>
      <input
        type="checkbox"
        className={styles.checkboxInput}
        id={id}
        {...props}
      />
      {label && (
        <label
          className="form-check-label inline-block text-slate-500 dark:text-slate-600"
          htmlFor={id}
        >
          {label}
        </label>
      )}{" "}
    </div>
  );
}

export default CheckBox;
