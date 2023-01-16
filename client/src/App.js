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

function App() {
  return (
    <section>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="login" element={<LoginPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          {/* protected page */}
          <Route element={<PersistLogin />}>
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
            <Route
              element={<RequireAuth allowedRoles={[Shared.Roles.admin]} />}
            >
              <Route path="admin" element={<AdminPage />} />
            </Route>
            <Route
              element={<RequireAuth allowedRoles={[Shared.Roles.super]} />}
            >
              <Route path="super" element={<SuperPage />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[Shared.Roles.user]} />}>
              <Route path="user" element={<UserPage />} />
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
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();

  const signOut = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="antialiased h-screen bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400  ">
      {/* TOPBAR */}

      <ul className="flex flex-row items-center justify-between px-12 py-6">
        <ul className="flex flex-row gap-x-4">
          <li>
            <Link to="/">Home Page</Link>
          </li>
        </ul>
        <ul className="flex flex-row items-center gap-x-4">
          <li>
            <ThemeSwitcher />
          </li>

          {auth.accessToken && (
            <li>
              <Button onClick={() => signOut()}>Logout</Button>
            </li>
          )}
        </ul>
      </ul>

      <Outlet />
    </div>
  );
}

export default App;
