import React from "react";
import Posts from "./Posts";

function AdminPage() {
  return (
    <div className="h-screen bg-white dark:bg-black flex flex-col justify-center items-center">
      AdminPage
      <br />
      <Posts />
    </div>
  );
}

export default AdminPage;
