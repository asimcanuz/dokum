import React from "react";
import cn from "classnames";
import styles from "./Alert.module.css";
import PropTypes from "prop-types";

function Alert({apperance, children}) {
  return (
    <div className={cn(styles.base, styles?.[apperance])} role={"alert"}>
      {children}
    </div>
  );
}

Alert.propTypes = {
  apperance: PropTypes.oneOf(['primary',
    'secondary',
    'success',
    'danger',
    'warning']).isRequired
}

export default Alert;
