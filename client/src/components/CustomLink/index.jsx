import React from "react";
import { Link } from "react-router-dom";

function CustomLink({ to, children, ...props }) {
  return (
    <Link
      to={to}
      className="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
      {...props}
    >
      {children}
    </Link>
  );
}

export default CustomLink;
