import React, { Fragment, useState } from "react";
import styles from "./Input.module.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function PasswordInput({ ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center justify-end ">
      <input
        type={show ? "text" : "password"}
        className={styles.passInput}
        {...props}
      />
      <div className={styles.passIcon} onClick={() => setShow(!show)}>
        {!show ? (
          <AiOutlineEye
            className="text-gray-800 dark:text-gray-500 w-5 h-5"
            scale={"24px"}
          />
        ) : (
          <AiOutlineEyeInvisible
            className="text-gray-800 dark:text-gray-500 w-5 h-5"
            scale={"24px"}
          />
        )}
      </div>
    </div>
  );
}

export default PasswordInput;
