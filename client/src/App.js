import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import RequireAuth from "./utils/RequireAuth";
import Shared from "./utils/Shared";
import AdminPage from "./pages/AdminPage";
import SuperPage from "./pages/SuperPage";
import UserPage from "./pages/UserPage";
import Unauthorized from "./pages/Unauthorized";
import NotFoundPage from "./pages/NotFoundPage";
import Button from "./components/Button";
import useLogout from "./hooks/useLogout";
import PersistLogin from "./utils/PersistLogin";
import ThemeSwitcher from "./components/ThemeSwitcher";
import useAuth from "./hooks/useAuth";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import AccountsPage from "./pages/Accounts/AccountsPage";
import CustomersPage from "./pages/Customers/CustomersPage";

function App() {
  return (
    <section className="app ">
      <ThemeSwitcher />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="unauthorized" element={<Unauthorized />} />
          {/* PROTECTED ROUTES */}
          <Route element={<PersistLogin />}>
            {/* HOME PAGE */}
            <Route
              element={
                <RequireAuth
                  allowedRoles={[
                    Shared.Roles.admin,
                    Shared.Roles.user,
                    Shared.Roles.super,
                  ]}
                />
              }
            >
              <Route path="/" element={<HomePage />} />
            </Route>

            {/* Admin Page */}
            <Route
              element={<RequireAuth allowedRoles={[Shared.Roles.admin]} />}
            >
              <Route path="admin" element={<AdminPage />} />
            </Route>
            {/* SUPER PAGE */}
            <Route
              element={
                <RequireAuth
                  allowedRoles={[Shared.Roles.admin, Shared.Roles.super]}
                />
              }
            >
              <Route path="super" element={<SuperPage />} />
            </Route>
            {/* USER PAGE */}
            <Route
              element={
                <RequireAuth
                  allowedRoles={[Shared.Roles.admin, Shared.Roles.user]}
                />
              }
            >
              <Route path="user" element={<UserPage />} />
            </Route>

            {/* ACCOUNTS PAGE */}
            <Route
              element={
                <RequireAuth
                  allowedRoles={[Shared.Roles.admin, Shared.Roles.super]}
                />
              }
            >
              <Route path="accounts" element={<AccountsPage />} />
            </Route>
            {/* CUSTOMERS PAGE */}
            <Route
              element={
                <RequireAuth
                  allowedRoles={[
                    Shared.Roles.admin,
                    Shared.Roles.super,
                    Shared.Roles.user,
                  ]}
                />
              }
            >
              <Route path="customers" element={<CustomersPage />} />
            </Route>
          </Route>
          {/* catch all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </section>
  );
}

function Layout() {
  const [sidebarCollapse, setSidebarCollapse] = useState(false);

  const handleSidebar = () => {
    setSidebarCollapse(!sidebarCollapse);
  };

  return (
    <div className="antialiased bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 min-h-screen">
      <div className="flex flex-col md:flex-row ">
        <Sidebar collapse={sidebarCollapse} handleSidebar={handleSidebar} />

        <div className="flex-1 px-12 py-11">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default App;
