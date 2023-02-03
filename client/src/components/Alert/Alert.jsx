import React from "react";
import cn from "classnames";
import styles from "./Alert.module.css";

function Alert({ apperance, children }) {
  return (
    <div className={cn(styles.base, styles?.[apperance])} role={"alert"}>
      {children}
    </div>
  );
}

export default Alert;
