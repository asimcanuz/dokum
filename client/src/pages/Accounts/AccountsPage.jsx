import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { Endpoints } from "../../constants/Endpoints";
import { useGlobalFilter, useTable } from "react-table";
import Button from "../../components/Button";
import { ROLES } from "../../constants/RolesConstants";
import AccountCreateAndUpdateModal from "./AccountCreateAndUpdateModal";
import AccountPasswordUpdateModal from "./AccountPasswordUpdateModal";
import GlobalFilter from "../../components/GlobalFilter/GlobalFilter";
import { AiOutlinePlus } from "react-icons/ai";
import DynamicTable from "../../components/Table";

const initialState = {
  defaultUserValues: {
    email: "",
    password: "",
    roleId: "",
    userId: "",
    username: "",
    isActive: true,
  },
};
function AccountsPage() {
  const [users, setUsers] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const effectRun = useRef(false);

  const [infoModalSettings, setInfoModalSettings] = useState({
    type: "",
    open: false,
    values: initialState.defaultUserValues,
  });

  const [passwordModalSettings, setPasswordModalSettings] = useState({
    open: false,
    userId: "",
  });

  const closeModal = async () => {
    await setInfoModalSettings({
      type: "",
      open: false,
      values: initialState.defaultUserValues,
    });
  };
  const closePassModal = async () => {
    await setPasswordModalSettings({
      open: false,
      userId: "",
      values: { open: false, userId: "" },
    });
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.USERS_URL, {
          signal: controller.signal,
        });
        isMounted && setUsers(response.data.users);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getUsers();
    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  const tableColumns = React.useMemo(
    () => [
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "roleId",
        Cell: ({ value }) => ROLES[value],
      },
      {
        Header: "Aktif",
        accessor: "isActive",
        width: 70,
        Cell: ({ value }) => (value ? "Aktif" : "Pasif"),
      },
      {
        Header: "Opsiyonlar",
        Cell: (tableProps) => (
          <div className="space-x-4 py-2">
            <Button
              appearance={"success"}
              onClick={() => {
                setInfoModalSettings({
                  open: true,
                  values: tableProps.row.original,
                  type: "update",
                });
              }}
            >
              Güncelle
            </Button>
            <Button
              appearance={"danger"}
              onClick={() => {
                setPasswordModalSettings({
                  open: true,
                  userId: tableProps.row.original.userId,
                });
              }}
            >
              Şifre Güncelle
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({ columns: tableColumns, data: users }, useGlobalFilter);
  return (
    <div className="space-y-4">
      <Header
        title={"Hesap Sayfası"}
        description={"Şirketine bağlı kullanıcıları yönet"}
      />
      <div className="flex flex-col md:flex-row justify-between w-full">
        <Button
          appearance={"primary"}
          onClick={() => {
            setInfoModalSettings({
              open: true,
              values: initialState.defaultUserValues,
              type: "add",
            });
          }}
        >
          <AiOutlinePlus
            className="text-white font-bold mr-4"
            size={"16px"}
            color="white"
          />
          Yeni Kullanıcı Ekle
        </Button>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      {users?.length > 0 ? (
        <DynamicTable
          preGlobalFilteredRows={preGlobalFilteredRows}
          state={state}
          setGlobalFilter={setGlobalFilter}
          getTableProps={getTableProps}
          headerGroups={headerGroups}
          getTableBodyProps={getTableBodyProps}
          rows={rows}
          prepareRow={prepareRow}
        />
      ) : (
        <div>No Data!</div>
      )}
      {infoModalSettings.open ? (
        <AccountCreateAndUpdateModal
          size={"large"}
          type={infoModalSettings.type}
          open={infoModalSettings.open}
          defaultValues={infoModalSettings.values}
          users={users}
          setUsers={setUsers}
          toggle={closeModal}
        />
      ) : null}
      {passwordModalSettings.open ? (
        <AccountPasswordUpdateModal
          size={"large"}
          open={passwordModalSettings.open}
          userId={passwordModalSettings.userId}
          toggle={closePassModal}
        />
      ) : null}
    </div>
  );
}

export default AccountsPage;

// <table
//   {...getTableProps()}
//   className="min-w-full divide-y divide-gray-200 mt-2"
// >
//   <thead className="bg-gray-50">
//     {headerGroups.map((headerGroup) => (
//       <tr {...headerGroup.getHeaderGroupProps()}>
//         {headerGroup.headers.map((column) => (
//           <th
//             {...column.getHeaderProps()}
//             className="py-3 text-xs font-bold text-left text-gray-500 uppercase"
//           >
//             <div className="flex flex-1 items-center">
//               {column.render("Header")}
//               {column.isSorted ? (
//                 <FaSort className="text-xs ml-4" />
//               ) : (
//                 ""
//               )}
//             </div>
//           </th>
//         ))}
//       </tr>
//     ))}
//   </thead>
//   <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
//     {rows.map((row) => {
//       prepareRow(row);
//       return (
//         <tr
//           {...row.getRowProps()}
//           className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap"
//         >
//           {row.cells.map((cell) => {
//             return (
//               <td
//                 {...cell.getCellProps({
//                   style: {
//                     width: cell.column.width,
//                   },
//                 })}
//               >
//                 {cell.render("Cell")}
//               </td>
//             );
//           })}
//         </tr>
//       );
//     })}
//   </tbody>
// </table>
