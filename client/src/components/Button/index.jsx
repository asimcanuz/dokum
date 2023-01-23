import cn from "classnames";
import styles from "./Button.module.css";

export default function Button({
  appearance,
  variant,
  size,
  block,
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        styles.base,
        styles?.[appearance]
        // styles?.[variant],
        // styles?.[size],
        // block ? styles?.block : null
      )}
      {...props}
    >
      {children}
    </button>
  );
}
