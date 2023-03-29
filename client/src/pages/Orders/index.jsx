import React, { Fragment, useEffect, useState } from "react";
import Header from "../../components/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { Endpoints } from "../../constants/Endpoints";
import { useGlobalFilter, usePagination, useTable } from "react-table";
import Alert from "../../components/Alert/Alert";

function OrderMain() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  // const [page, setPage] = useState(1);
  // const [totalPage, setTotalPage] = useState(1);
  const tableColumns = React.useMemo(
    () => [
      {
        Header: "Sipariş ID",
        accessor: "orderId",
      },
      {
        Header: "Agac No",
        accessor: "treeId",
      },
      {
        Header: "Liste No",
        accessor: "tree.listNo",
      },
      {
        Header: "Hesap No",
        accessor: "customer.accountNumber",
      },
      {
        Header: "Müşteri Adı",
        accessor: "customer.customerName",
      },
      {
        Header: "Ayar",
        accessor: "tree.option.optionText",
      },
      {
        Header: "Renk",
        accessor: "tree.color.colorName",
      },
      {
        Header: "Kalınlık",
        accessor: "tree.thick.thickName",
      },
      {
        Header: "Açıklama",
        accessor: "description.descriptionText",
      },
      {
        Header: "Döküm Tarihi",
        accessor: "tree.date",
      },
      {
        Header: "Adet",
        accessor: "quantity",
      },
      {
        Header: "İşlem Durumu",
        accessor: "tree.treeStatus.treeStatusName",
        Cell: (row) => {
          const rowBackgroundColor = () => {
            switch (row.value) {
              case "Hazırlanıyor":
                return "bg-yellow-200";
              case "Dökümde":
                return "bg-green-200";
              case "Döküldü":
                return "bg-blue-200";
              case "Kesimde":
                return "bg-purple-200";
              default:
                return "bg-white";
            }
          };
          const cn =
            rowBackgroundColor() +
            " text-center text-sm font-semibold p-1 rounded w-32 mx-auto";
          return <div className={cn}>{row.value}</div>;
        },
      },
      {
        Header: "Aktif-Pasif",
        accessor: "tree.active",
        Cell: (row) => {
          let cn = row.value ? "bg-green-700" : "bg-red-500";
          cn +=
            " text-white p-1 rounded text-sm font-semibold text-center w-16 mx-auto ";
          return <div className={cn}>{row.value ? "Aktif" : "Pasif"}</div>;
        },
      },
      {
        Header: "Gün Sonu",
        accessor: "tree.finished",
        Cell: (row) => {
          let cn = row.value ? "bg-green-700" : "bg-red-500";
          cn +=
            " text-white p-1 rounded text-sm font-semibold text-center w-16 ";
          return <div className={cn}>{row.value ? "Evet" : "Hayır"}</div>;
        },
      },
      {
        Header: "Hazırlayan",
        accessor: "tree.creator.creatorName",
      },
    ],

    [orders]
  );
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.ORDER, {
          signal: controller.signal,
        });

        if (isMounted) {
          setOrders(response.data.orders.rows);
          // setTotalPage(response.data.orders.count);
        }
      } catch (error) {
        console.log(error);
      }
    };

    isMounted && getOrders();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    page,
    preGlobalFilteredRows,
    setGlobalFilter,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns: tableColumns,
      data: orders,
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="overflow-x-scroll">
      <section className="space-y-4">
        <Header
          title="Siparişler"
          description="Siparişlerinizi bu sayfadan takip edebilirsiniz."
        />
      </section>

      <div className="mt-4">
        {orders.length > 0 ? (
          <div>
            <table
              {...getTableProps()}
              className="min-w-full text-left text-sm font-light"
            >
              <thead className="border-b font-medium dark:border-neutral-500 bg-gray-50">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        scope="col"
                        className="px-6 py-4"
                        {...column.getHeaderProps()}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                  prepareRow(row);

                  const rowBackgroundColor = () => {
                    switch (row.original.tree.treeStatus.treeStatusName) {
                      case "Hazırlanıyor":
                        return "bg-yellow-100";
                      case "Dökümde":
                        return "bg-green-100";
                      case "Döküldü":
                        return "bg-blue-100";
                      case "Kesimde":
                        return "bg-purple-100";
                      default:
                        return "bg-white";
                    }
                  };
                  return (
                    // <Fragment key={i} {...row.getRowProps()}>
                    <Fragment key={i}>
                      <tr
                        align="center"
                        className={` text-left hover:mouse-pointer text-black hover:bg-neutral-200 select-none border-b  ${rowBackgroundColor()}`}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td
                              className="whitespace-nowrap px-6 py-4"
                              {...cell.getCellProps()}
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>

            <div class="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4">
              <div class="w-full  flex items-center justify-between border-t border-gray-200">
                <div
                  class="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.1665 4H12.8332"
                      stroke="currentColor"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1.1665 4L4.49984 7.33333"
                      stroke="currentColor"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1.1665 4.00002L4.49984 0.666687"
                      stroke="currentColor"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p class="text-sm ml-3 font-medium leading-none ">Önceki</p>
                </div>
                <div class="sm:flex hidden">
                  {pageOptions.map((page) => {
                    let activePage = null;
                    if (page === state.pageIndex) {
                      activePage = "text-indigo-700 border-indigo-400";
                    }

                    return (
                      <p
                        className={`text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2 ${activePage}`}
                        onClick={() => gotoPage(page)}
                      >
                        {page + 1}
                      </p>
                    );
                  })}
                </div>
                <div
                  class="flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  <p class="text-sm font-medium leading-none mr-3">Sonraki</p>
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.1665 4H12.8332"
                      stroke="currentColor"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.5 7.33333L12.8333 4"
                      stroke="currentColor"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.5 0.666687L12.8333 4.00002"
                      stroke="currentColor"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Alert apperance={"danger"}>Veri bulunamadı!</Alert>
        )}
      </div>
    </div>
  );
}

export default OrderMain;
