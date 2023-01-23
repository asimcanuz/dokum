import React from "react";
import { Link } from "react-router-dom";
function HomePage() {
  return (
    <div className=" flex justify-center items-center">
      <ul>
        <li>
          <Link to="/admin">Admin Page</Link>
        </li>
        <li>
          <Link to="/super">Super Page </Link>
        </li>
        <li>
          <Link to="/user">User Page </Link>
        </li>
      </ul>
    </div>
  );
}

export default HomePage;
