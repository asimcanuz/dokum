import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useExpanded, useGlobalFilter, useTable } from "react-table";
import Alert from "../../components/Alert/Alert";
import GlobalFilter from "../../components/GlobalFilter/GlobalFilter";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { BiChevronDown, BiChevronRight, BiLabel, BiSave } from "react-icons/bi";
import CreateLabel from "./CreateLabel";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import calculateWaxWeight from "../../utils/CalculateWaxWeight";

function TreeTable({
  todayTrees,
  customers,
  descriptions,
  treeStatuses,
  creators,
  setClickTree,
  setUpdateClick,
  setTodayTrees,
  clickTreeId,
  jobGroups,
  selectedJobGroup,
  setSelectedJobGroup,
  treeTableRef,
}) {
  const axiosPrivate = useAxiosPrivate();
  const [orderFilter, setOrderFilter] = useState("");
  const [createLabel, setCreateLabel] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const editableKeyToFocus = useRef(null);
  const mineralWeightRef = useRef(null);

  const renderOrderTable = React.useCallback(
    ({ row }) => {
      let orders = [];
      row.original.orders.forEach((order) => {
        let customer = customers?.find(
          (customer) => customer?.customerId === order?.customerId
        );
        let description = descriptions?.find(
          (description) => description?.descriptionId === order?.descriptionId
        )?.descriptionText;
        const _order = {
          id: order.orderId,
          hesapNo: customer.accountNumber,
          musteriAdi: customer.customerName,
          adet: order.quantity,
          aciklama: description,
        };
        orders.push(_order);
      });

      if (orderFilter !== "") {
        orders = orders.filter((order) => {
          return (
            order.hesapNo
              .toLocaleLowerCase()
              .includes(orderFilter.toLocaleLowerCase()) ||
            order.musteriAdi
              .toLocaleLowerCase()
              .includes(orderFilter.toLocaleLowerCase()) ||
            order.aciklama
              .toLocaleLowerCase()
              .includes(orderFilter.toLocaleLowerCase())
          );
        });
      }

      return (
        <div className=" flex flex-col ">
          <Input
            type={"text"}
            placeholder={"Sipariş Filtre"}
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
          />
          <table className=" w-full divide-y divide-gray-200 mt-2">
            <thead>
              <tr className="space-x-4">
                <th className=" text-xs font-bold text-left text-gray-500 uppercase">
                  Hesap No
                </th>
                <th className="text-xs font-bold text-left text-gray-500 uppercase">
                  Müşteri Adı
                </th>
                <th className="text-xs font-bold text-left text-gray-500 uppercase">
                  Adet
                </th>
                <th className=" text-xs font-bold text-left text-gray-500 uppercase">
                  Açıklama
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                return (
                  <tr key={order.id} className="space-x-4">
                    <td className=" text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {order.hesapNo}
                    </td>
                    <td className=" text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {order.musteriAdi}
                    </td>
                    <td className=" text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {order.adet}
                    </td>
                    <td className=" text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {order.aciklama}
                    </td>
                    <td className="space-x-4">
                      <Button
                        appearance={"danger"}
                        onClick={() => {
                          let deletedOrder = axiosPrivate.delete(
                            Endpoints.ORDER,
                            {
                              data: { orderId: order.id },
                            },
                            {
                              headers: { "Content-Type": "application/json" },
                              withCredentials: true,
                            }
                          );
                          deletedOrder.then((res) => {
                            let newTodayTrees = todayTrees.map((todayTree) => {
                              if (todayTree.treeId === row.original.treeId) {
                                let newOrders = todayTree.orders.filter(
                                  (tree) => tree.orderId !== order.id
                                );
                                todayTree.orders = newOrders;
                              }
                              return todayTree;
                            });
                            setTodayTrees(newTodayTrees);
                          });
                        }}
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    },
    [customers, descriptions, orderFilter]
  );

  const handleSaveMineralWeight = (treeId) => {
    let todayTree = todayTrees.find((todayTree) => todayTree.treeId === treeId);

    axiosPrivate.put(
      Endpoints.TREE.MAIN + "/mineralWeight",
      {
        treeId: treeId,
        mineralWeight: todayTree.mineralWeight,
        waxWeight: isNaN(
          Number(
            calculateWaxWeight(
              todayTree.mineralWeight,
              todayTree.option.optionText,
              todayTree.color.colorName
            )
          )
        )
          ? 0
          : Number(
              calculateWaxWeight(
                todayTree.mineralWeight,
                todayTree.option.optionText,
                todayTree.color.colorName
              )
            ),
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  };
  const tableColumns = React.useMemo(
    () => [
      {
        Header: () => null, // No header
        id: "expander", // It needs an ID for expander
        Cell: ({ row }) => (
          <span
            onClick={() => {
              handleRowClick(row);
              let clickedTree = row.original;
              let customerIds = [];

              clickedTree.orders.forEach((order) => {
                if (!customerIds.includes(order.customerId)) {
                  customerIds.push(order.customerId);
                }
              });
              setClickTree({
                agacId: clickedTree.treeId,
                agacNo: clickedTree.treeNo,
                listeNo: clickedTree.listNo,
                siparisSayisi: clickedTree.orders.length,
                renk: clickedTree.color.colorName,
                ayar: clickedTree.option.optionText,
                kalinlik: clickedTree.thick.thickName,
                musteriSayisi: customerIds.length,
              });
            }}
          >
            {row.id === expandedRow ? (
              <BiChevronDown className="text-xl" />
            ) : (
              <BiChevronRight className="text-xl" />
            )}
          </span>
        ),
      },
      {
        Header: "İş Grup",
        accessor: "jobGroup.date",
      },
      {
        Header: "Ağaç Id",
        accessor: "treeId",
      },
      {
        Header: "Agac No",
        accessor: "treeNo",
      },
      {
        Header: "Liste No",
        accessor: "listNo",
      },
      {
        Header: "Acil Mi?",
        accessor: "isImmediate",
        Cell: ({ value, row }) => {
          if (value) {
            return (
              <div
                className="bg-red-100 rounded-lg py-2 px-3 mb-4 text-base text-red-700 "
                role="alert"
              >
                Evet
              </div>
            );
          } else {
            return (
              <div
                className="bg-blue-100 rounded-lg py-2 px-3 mb-4 text-base text-blue-700 "
                role="alert"
              >
                Hayır
              </div>
            );
          }
        },
      },
      {
        Header: "Musteri Adet",
        accessor: "",
        Cell: ({ row }) => {
          let customerIds = [];
          row.original.orders.forEach((order) => {
            if (!customerIds.includes(order.customerId)) {
              customerIds.push(order.customerId);
            }
          });
          return customerIds.length;
        },
      },
      {
        Header: "Agac Tipi",
        accessor: "",
        Cell: ({ row }) => {
          if (row.original.orders.length === 1) {
            return row.original.orders[0].customer.customerName;
          } else {
            return "Karışık";
          }
        },
      },
      {
        Header: "Mum Turu",
        accessor: "wax.waxName",
      },
      {
        Header: "Ayar",
        accessor: "option.optionText",
      },
      {
        Header: "Kalınlık",
        accessor: "thick.thickName",
      },
      {
        Header: "Renk",
        accessor: "color.colorName",
      },
      {
        Header: "Tarih",
        accessor: "date",
      },
      {
        Header: "Durum",
        accessor: "treeStatus.treeStatusName",
      },
      {
        Header: "Hazırlayan",
        accessor: "creator.creatorName",
      },
      {
        Header: "Maden Ağırlık",
        accessor: "",
        Cell: ({ row }) => {
          return (
            <div>
              {calculateWaxWeight(
                row.original.mineralWeight,
                row.original.option.optionText,
                row.original.color.colorName
              )}
            </div>
          );
        },
      },
      {
        Header: "Mum Ağırlık",
        accessor: "mineralWeight",
        Cell: ({ row }) => {
          return (
            <input
              type="number"
              value={row.original.mineralWeight || ""}
              autoFocus={row.id === editableKeyToFocus.current}
              className=" border-none text-gray-800 mr-3 py-1 px-2 leading-tight focus:outline-none hover:bg-white focus:bg-white"
              onChange={(e) => {
                editableKeyToFocus.current = row.id;
                var value = e.target.value.replace(",", "");
                value = value.replace(".", "");

                let newTodayTrees = todayTrees.map((todayTree) => {
                  if (todayTree.treeId === row.original.treeId) {
                    todayTree.mineralWeight = value;
                  }
                  return todayTree;
                });
                setTodayTrees(newTodayTrees);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveMineralWeight(row.original.treeId);
                }
              }}
              onBlur={(e) => {
                editableKeyToFocus.current = null;
                handleSaveMineralWeight(row.original.treeId);
              }}
            />
          );
        },
      },
      {
        Header: "Sil",
        Cell: ({ row }) => {
          return (
            <Button
              appearance={"danger"}
              onClick={() => {
                let deletedTree = axiosPrivate.put(Endpoints.TREE.PASSIVE, {
                  treeId: row.original.treeId,
                });

                deletedTree.then((res) => {
                  let newTodayTrees = todayTrees.filter(
                    (todayTree) => todayTree.treeId !== row.original.treeId
                  );
                  setTodayTrees(newTodayTrees);
                });
              }}
            >
              Sil
            </Button>
          );
        },
      },
      // {
      //   Header: "Mum Ağırlık",
      //   accessor: "",
      // },
      // {
      //   Header: "Maden Ağırlık",
      //   accessor: "",
      // },
    ],
    [todayTrees, expandedRow]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    toggleRowExpanded,
    preGlobalFilteredRows,
    setGlobalFilter,
    visibleColumns,
  } = useTable(
    {
      columns: tableColumns,
      data: todayTrees,
      autoResetExpanded: false,
    },
    useGlobalFilter,
    useExpanded
  );

  const handleRowClick = (row) => {
    if (row.id === expandedRow) {
      setExpandedRow(null);
    } else {
      setExpandedRow(row.id);
    }
  };
  useEffect(() => {
    rows.forEach((row) => {
      if (row.id !== expandedRow) {
        toggleRowExpanded(row, false);
      }
    });
  }, [expandedRow, rows]);

  return (
    <div className="space-y-4">
      <div className="flex flex-row justify-between items-center">
        <div className="w-1/2 flex flex-row items-center space-x-11">
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <div className="">
            <h3>
              İş Grup : {jobGroups.find((j) => j.id === selectedJobGroup)?.date}
            </h3>
          </div>
        </div>
        <Button
          appearance={"success"}
          onClick={() => {
            try {
              if (selectedJobGroup === null || selectedJobGroup === "") {
                throw new Error("İş grubu seçiniz!");
              } else {
                setCreateLabel(true);
              }
            } catch (e) {
              alert(e.message);
            }
          }}
        >
          <BiLabel />
          <span>Etiket Oluştur</span>
        </Button>
      </div>
      {todayTrees.length > 0 ? (
        <table
          {...getTableProps()}
          className="min-w-full text-left text-sm font-light overflow-x-scroll max-h-screen overflow-y-auto"
        >
          <thead className="border-b font-medium dark:border-neutral-500">
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
            {rows.map((row, i) => {
              prepareRow(row);
              const rowBackgroundColor = () => {
                switch (row.original.treeStatus.treeStatusName) {
                  case "Hazırlanıyor":
                    return "bg-gray-50";
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
                <>
                  <tr
                    align="center"
                    className={`hover:mouse-pointer text-black hover:bg-neutral-200 select-none border-b  ${rowBackgroundColor()}`}
                    {...row.getRowProps()}
                    onClick={() => {
                      // id,ağaç no, liste no, sipariş sayısı,renk,ayar
                    }}
                    onDoubleClick={() => {
                      const {
                        active,
                        colorId,
                        creatorId,
                        date,
                        isImmediate,
                        listNo,
                        optionId,
                        processId,
                        thickId,
                        treeNo,
                        treeStatusId,
                        waxId,
                        treeId,
                      } = row.original;
                      setUpdateClick({
                        open: true,
                        treeId,
                        active,
                        colorId,
                        creatorId,
                        date,
                        isImmediate,
                        listNo,
                        optionId,
                        processId,
                        thickId,
                        treeNo,
                        treeStatusId,
                        waxId,
                      });
                    }}
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
                  {row.id === expandedRow ? (
                    <tr>
                      <td className="pl-12 " colSpan={visibleColumns.length}>
                        {renderOrderTable({ row })}
                      </td>
                    </tr>
                  ) : null}
                </>
              );
            })}
          </tbody>
        </table>
      ) : (
        <Alert apperance={"danger"}>Veri bulunamadı!</Alert>
      )}
      {createLabel ? (
        <CreateLabel
          open={createLabel}
          jobGroupId={selectedJobGroup}
          toggle={async () => {
            setCreateLabel(false);
          }}
        />
      ) : null}
    </div>
  );
}

export default TreeTable;
