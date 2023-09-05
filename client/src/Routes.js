import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import RequireAuth from './utils/RequireAuth';
import Shared from './utils/Shared';
import Unauthorized from './pages/Unauthorized';
import NotFoundPage from './pages/NotFoundPage';
import PersistLogin from './utils/PersistLogin';
import AccountsPage from './pages/Accounts/AccountsPage';
import CustomersPage from './pages/Customers/CustomersPage';
import Layout from './components/Layout';
import ConfigurationsPage from './pages/Configurations/ConfigurationsPage';
import { rolesDesc } from './constants/RolesConstants';
import TreePage from './pages/Tree';
import EndDayMain from './pages/EndDay';
import OrderMain from './pages/Orders';
import ReportsPage from './pages/Reports';
import OvenMainPage from './pages/Oven';
import Wallboard from './pages/Wallboard';
import CustomerTrackingPage from "./pages/CustomerTracking/CustomerTracking";

function Routers() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/' element={<Layout />}>
        <Route path='unauthorized' element={<Unauthorized />} />
        {/* PROTECTED ROUTES */}
        <Route element={<PersistLogin />}>
          {/* HOME PAGE */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[Shared.Roles.admin, Shared.Roles.user, Shared.Roles.super]}
              />
            }
          >
            <Route path='/' element={<TreePage />} />
          </Route>

          {/* ACCOUNTS PAGE */}
          <Route element={<RequireAuth allowedRoles={[Shared.Roles.admin, Shared.Roles.super]} />}>
            <Route path='accounts' element={<AccountsPage />} />
          </Route>
          {/* CUSTOMERS PAGE */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[Shared.Roles.admin, Shared.Roles.super, Shared.Roles.user]}
              />
            }
          >
            <Route path='customers' element={<CustomersPage />} />
          </Route>
          {/* Wallboard PAGE */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[Shared.Roles.admin, Shared.Roles.super, Shared.Roles.user]}
              />
            }
          >
            <Route path='wallboard' element={<Wallboard />} />
          </Route>
          {/* CONFIGURATION PAGE */}
          <Route element={<RequireAuth allowedRoles={[Shared.Roles.admin, Shared.Roles.super]} />}>
            <Route path='configurations' element={<ConfigurationsPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[Shared.Roles.admin, Shared.Roles.super]} />}>
            <Route path='endDay' element={<EndDayMain />} />
          </Route>
          <Route
            element={
              <RequireAuth
                allowedRoles={[Shared.Roles.admin, Shared.Roles.super, Shared.Roles.user]}
              />
            }
          >
            <Route path='orders' element={<OrderMain />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[Shared.Roles.admin, Shared.Roles.super]} />}>
            <Route path='customerTracking' element={<CustomerTrackingPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[Shared.Roles.admin, Shared.Roles.super]} />}>
            <Route path='oven' element={<OvenMainPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[Shared.Roles.admin]} />}>
            <Route path='reports' element={<ReportsPage />} />
          </Route>
          {/* TREE PAGE */}
          <Route element={<RequireAuth allowedRoles={rolesDesc.allOf} />}>
            <Route path='tree' element={<TreePage />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path='*' element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default Routers;
