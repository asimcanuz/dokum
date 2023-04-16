import React from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import {
  AiOutlineRight,
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineSetting,
  AiOutlineShoppingCart,
  AiOutlineCalendar,
} from "react-icons/ai";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BsPersonSquare } from "react-icons/bs";
import { MdOutlineAccountTree, MdOutlinePeopleAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { rolesDesc } from "../../constants/RolesConstants";

const Menus = [
  // {
  //   title: "Ana Sayfa",
  //   src: "Home",
  //   to: "/",
  //   icon: AiOutlineHome,
  //   roles: rolesDesc.allOf,
  // },
  {
    title: "Ağaç",
    src: "Tree",
    to: "/tree",
    roles: rolesDesc.allOf,
    icon: MdOutlineAccountTree,
  },
  {
    title: "Siparişler",
    src: "Orders",
    to: "/orders",
    roles: rolesDesc.allOf,
    icon: AiOutlineShoppingCart,
  },
  {
    title: "Gün Sonu",
    src: "EndDay",
    to: "/endDay",
    roles: rolesDesc.allOf,
    icon: AiOutlineCalendar,
  },
  {
    title: "Müşteri Takip",
    src: "CustomerTracking",
    to: "/customerTracking",
    roles: rolesDesc.allOf,
    icon: BsPersonSquare,
  },
  {
    title: "Raporlar",
    src: "Reports",
    to: "/reports",
    roles: rolesDesc.onlyAdmin,
    icon: HiOutlineDocumentReport,
  },
  {
    title: "Hesaplar",
    src: "Accounts",
    to: "/accounts",
    roles: rolesDesc.onlyAdmin,
    icon: AiOutlineUser,
    gap: true,
  },
  {
    title: "Müşteriler",
    src: "Customers",
    to: "/customers",
    roles: rolesDesc.admin_super,

    icon: MdOutlinePeopleAlt,
  },
  {
    title: "Konfigürasyonlar",
    src: "configuration",
    to: "/configurations",
    roles: rolesDesc.admin_super,
    icon: AiOutlineSetting,
  },
];
function Sidebar({ collapse, handleSidebar }) {
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();

  async function signOut() {
    await logout();
    navigate("/login");
  }

  return (
    <aside
      className={`w-full
        ${
          collapse ? "md:w-72" : "md:w-24"
        } bg-transparent p-5  pt-8 relative duration-300 transition-all`}
    >
      <AiOutlineRight
        className={`absolute cursor-pointer -bottom-4 right-1/2 md:-right-4 md:top-11 md:bottom-0 w-8 h-8 text-slate-700 dark:text-white ${
          collapse ? "-rotate-90 md:rotate-180" : "rotate-90 md:rotate-0"
        } `}
        onClick={handleSidebar}
      />

      <Link to={"/"}>
        <div className="flex gap-x-4 items-center">
          <img
            src="images/logo.png"
            className={`cursor-pointer duration-500 `}
            alt="logo"
          />
        </div>
      </Link>
      <ul className="pt-6">
        {Menus.map(
          (Menu, index) =>
            Menu?.roles?.includes(auth?.role) && (
              <Link
                to={Menu?.to}
                key={index}
                className={` ${Menu.gap ? "mt-9" : "mt-2"} ${
                  !collapse
                    ? "hidden md:flex"
                    : "flex items-center duration-200"
                } 
                  group flex items-center text-sm  gap-3.5 font-medium p-2 hover:text-white hover:bg-gray-300 hover:dark:bg-slate-700 rounded-md`}
              >
                <li
                  className={` w-full h-full
                  duration-200
                  ${!collapse ? "hidden" : "flex items-center duration-200"} 
                  md:flex md:items-center
                  rounded-md p-2 cursor-pointer text-slate-600 hover:text-white dark:text-gray-300 text-sm items-start gap-x-4`}
                  onClick={() => navigate(Menu.to)}
                >
                  <div>{React.createElement(Menu?.icon, { size: "20" })}</div>{" "}
                  <span
                    className={`${
                      !collapse && "hidden"
                    } origin-left duration-200`}
                  >
                    {Menu.title}
                  </span>
                </li>
              </Link>
            )
        )}

        <li
          onClick={signOut}
          className={`
           duration-200
          
              ${
                !collapse ? "hidden" : "flex items-center duration-200"
              } md:flex md:items-center
              rounded-md p-2 cursor-pointer hover:bg-light-white  text-sm items-start gap-x-4 
              mt-12
              hover:animate-pulse
              text-red-800
                `}
        >
          <AiOutlineLogout size={"24px"} className="font-bold " />
          <span className={`${!collapse && "hidden"} origin-left duration-200`}>
            Logout
          </span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
