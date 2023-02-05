import React, { useEffect, useState } from "react";
import cn from "classnames";
import { FaAngleUp } from "react-icons/fa";
import styles from "./ScrollTop.module.css";
function ScrollToTop() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.topToBtn}>
      {showTopBtn && (
        <FaAngleUp className={styles.iconStyle} onClick={goToTop} />
      )}
    </div>
  );
}

export default ScrollToTop;
