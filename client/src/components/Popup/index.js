import React from "react";
import styles from "./popup.module.css";
import cn from "classnames";
function Popup({ children, open, setOpen }) {
  return (
    <div className={cn(styles.popup, styles?.open)}>
      <div className={styles.popupContent}>
        <div className={styles.popupClose} onClick={() => setOpen(false)}>
          X
        </div>
        {children}
      </div>
    </div>
  );
}
export default Popup;
