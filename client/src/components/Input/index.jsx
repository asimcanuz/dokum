import React from "react";
import styles from "./Input.module.css";
import cn from "classnames";

function Input({ type, placeholder, flexible, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={cn(styles.inputs, flexible ? styles.flexible : null)}
      {...props}
    />
  );
}

export default Input;
