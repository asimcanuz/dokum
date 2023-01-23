import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";
import cn from "classnames";

function Modal({ size, open, children }) {
  return open ? (
    <Fragment>
      <div className={cn(styles.modalBody)}>
        <div className={cn(styles?.[size])}>
          {/*content*/}
          <div className={cn(styles.modalContent)}>{children}</div>
        </div>
      </div>
    </Fragment>
  ) : null;
}

Modal.defaultProps = {
  size: "normal",
};
Modal.propTypes = {
  size: PropTypes.oneOf(["small", "normal", "large"]),
  open: PropTypes.bool,
  toogle: PropTypes.func,
};

export default Modal;
