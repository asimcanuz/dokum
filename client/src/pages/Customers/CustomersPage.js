import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGlobalFilter, useTable } from "react-table";
import { FaSort } from "react-icons/fa";
import Button from "../../components/Button";
import { AiOutlinePlus } from "react-icons/ai";
import GlobalFilter from "../../components/GlobalFilter/GlobalFilter";
import CustomerAddNewModal from "./CustomersAddNewModal";
import CustomerUpdateModal from "./CustomersUpdateModal";
import CustomersDeleteModal from "./CustomersDeleteModal";

function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [reqController, setReqController] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const [updateModal, setUpdateModal] = useState({
    open: false,
    values: "",
  });

  const [addNewModal, setAddNewModal] = useState({
    open: false,
  });

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: "",
    customerName: "",
  });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCustomers = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.CUSTOMERS.GET_ALL, {
          signal: controller.signal,
        });
        isMounted && setCustomers(response.data.customers);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getCustomers();
    setReqController(false);
    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, [reqController]);

  const tableColumns = React.useMemo(
    () => [
      {
        Header: "Müşteri",
        accessor: "customerName",
      },
      {
        Header: "Hesap Numarası",
        accessor: "accountNumber",
      },
      {
        Header: "Durum",
        accessor: "isActive",
        Cell: ({ value }) => (
          <div
            className={
              value
                ? "text-green-600 text-base text-bold"
                : "text-red-800 text-base text-bold"
            }
          >
            {value ? "Aktif" : "Pasif"}
          </div>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ value }) => (
          <Link
            to="#"
            onClick={(e) => {
              window.location.href = "mailto:" + value;
              e.preventDefault();
            }}
          >
            {value}
          </Link>
        ),
      },
      {
        Header: "Telefon Numarası",
        accessor: "phone",
      },
      {
        Header: "Opsiyonlar",
        Cell: (tableProps) => (
          <div className="space-x-4 py-2">
            <Button
              appearance={"success"}
              onClick={() => {
                setUpdateModal({
                  open: !updateModal.open,
                  values: tableProps.row.original,
                });
              }}
            >
              Güncelle
            </Button>
            <Button
              appearance={"danger"}
              onClick={() => {
                setDeleteModal({
                  open: !deleteModal.open,
                  id: tableProps.row.original.customerId,
                  customerName: tableProps.row.original.customerName,
                });
              }}
            >
              Sil
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
  } = useTable({ columns: tableColumns, data: customers }, useGlobalFilter);
  return (
    <div className="space-y-4">
      <Header title={"Müşteri"} description={"Müşterilerini yönet"} />
      <div className="flex flex-col md:flex-row justify-between w-full">
        <Button
          appearance={"primary"}
          onClick={() => {
            setAddNewModal({ open: !addNewModal.open });
          }}
        >
          <AiOutlinePlus
            className="text-white font-bold mr-4"
            size={"16px"}
            color="white"
          />
          Yeni Müşteri Ekle
        </Button>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      {customers?.length > 0 ? (
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-200 mt-2"
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="py-3 text-xs font-bold text-left text-gray-500 uppercase"
                  >
                    <div className="flex flex-1 items-center">
                      {column.render("Header")}
                      {column.isSorted ? (
                        <FaSort className="text-xs ml-4" />
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y divide-gray-200 ">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap"
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps({
                          style: {
                            width: cell.column.width,
                          },
                        })}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>No Data!</div>
      )}
      {addNewModal.open ? (
        <CustomerAddNewModal
          open={addNewModal.open}
          size="large"
          toggle={() => {
            setAddNewModal({ open: !addNewModal.open });
          }}
          customers={customers}
          setCustomers={setCustomers}
          setReqController={setReqController}
        />
      ) : null}
      {updateModal.open ? (
        <CustomerUpdateModal
          open={updateModal.open}
          size="large"
          toggle={() => {
            setUpdateModal({
              open: !updateModal.open,
              values: {},
            });
          }}
          defaultValues={updateModal.values}
          customers={customers}
          setCustomers={setCustomers}
        />
      ) : null}
      {deleteModal.open ? (
        <CustomersDeleteModal
          open={deleteModal.open}
          size="large"
          toggle={() => {
            setDeleteModal({
              open: !deleteModal.open,
              values: {},
            });
          }}
          id={deleteModal.id}
          customerName={deleteModal.customerName}
          customers={customers}
          setCustomers={setCustomers}
          setReqController={setReqController}
        />
      ) : null}
    </div>
  );
}

export default CustomersPage;
