import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import {
  AiOutlineHome,
  AiOutlineRight,
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";
import { MdOutlineAccountTree } from "react-icons/md";
import { Link } from "react-router-dom";
import Shared from "../../utils/Shared";

const Menus = [
  {
    title: "Home",
    src: "Home",
    to: "/",
    icon: AiOutlineHome,
    roles: [Shared.Roles.admin, Shared.Roles.super, Shared.Roles.user],
  },

  {
    title: "Accounts",
    src: "Accounts",
    to: "/accounts",
    roles: [Shared.Roles.admin],

    icon: AiOutlineUser,
  },
  {
    title: "Tree",
    src: "Tree",
    to: "/tree",
    roles: [Shared.Roles.admin, Shared.Roles.super, Shared.Roles.user],
    icon: MdOutlineAccountTree,
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

  console.log(auth);

  return (
    <aside
      className={`w-full 
        ${
          collapse ? "md:w-72" : "md:w-24"
        } bg-dark-purple  p-5  pt-8 relative duration-300 transition-all`}
    >
      <AiOutlineRight
        className={`absolute cursor-pointer bottom-0 right-1/2 md:-right-3 md:top-11 w-7 h-7 text-white ${
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
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !collapse && "rotate-0 md:scale-0"
            }`}
          >
            Mucevher Dokum
          </h1>
        </div>
      </Link>
      <ul className="pt-6">
        {Menus.map(
          (Menu, index) =>
            Menu?.roles?.includes(auth?.role) && (
              <Link
                to={Menu?.to}
                key={index}
                className={` ${
                  Menu.gap ? "mt-9" : "mt-2"
                } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
              >
                <li
                  className={`
              duration-200
              ${!collapse ? "hidden" : "flex items-center duration-200"} 
              md:flex md:items-center
              rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-start gap-x-4 
              ${index === 0 && "bg-light-white"} 
              hover:animate-pulse
                `}
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
