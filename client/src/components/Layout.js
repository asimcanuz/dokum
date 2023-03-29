import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";

function Layout() {
  const [sidebarCollapse, setSidebarCollapse] = useState(false);

  const handleSidebar = () => {
    setSidebarCollapse(!sidebarCollapse);
  };

  return (
    <div className="antialiased bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 min-h-screen">
      <ScrollToTop />

      <div className="flex flex-col md:flex-row ">
        <Sidebar collapse={sidebarCollapse} handleSidebar={handleSidebar} />

        <div className="flex-1 px-4 py-4 md:px-12 md:py-11">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;