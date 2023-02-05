import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import RequireAuth from "./utils/RequireAuth";
import Shared from "./utils/Shared";
import AdminPage from "./pages/AdminPage";
import SuperPage from "./pages/SuperPage";
import UserPage from "./pages/UserPage";
import Unauthorized from "./pages/Unauthorized";
import NotFoundPage from "./pages/NotFoundPage";
import PersistLogin from "./utils/PersistLogin";
import AccountsPage from "./pages/Accounts/AccountsPage";
import CustomersPage from "./pages/Customers/CustomersPage";
import Layout from "./components/Layout";
import ConfigurationsPage from "./pages/Configurations/ConfigurationsPage";
function Routers() {
  return (
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
          <Route element={<RequireAuth allowedRoles={[Shared.Roles.admin]} />}>
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
          {/* CONFIGURATION PAGE */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[Shared.Roles.admin, Shared.Roles.super]}
              />
            }
          >
            <Route path="configurations" element={<ConfigurationsPage />} />
          </Route>
        </Route>
        {/* catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Routers;
