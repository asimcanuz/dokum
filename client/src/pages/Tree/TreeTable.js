import React, { Fragment, useState } from "react";
import { useExpanded, useGlobalFilter, useTable } from "react-table";
import Alert from "../../components/Alert/Alert";
import GlobalFilter from "../../components/GlobalFilter/GlobalFilter";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { BiLabel } from "react-icons/bi";
import CreateLabel from "./CreateLabel";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";

function TreeTable({
  todayTrees,
  customers,
  descriptions,
  treeStatuses,
  creators,
  setClickTree,
  setUpdateClick,
  setTodayTrees,
  isHaveNotFinished,
}) {
  const axiosPrivate = useAxiosPrivate();
  const [orderFilter, setOrderFilter] = useState("");
  const [createLabel, setCreateLabel] = useState(false);
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
                          console.log("sil");
                          console.log(order.id);
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

  const tableColumns = React.useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: "expander", // It needs an ID
        Cell: ({ row }) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span
            style={{ fontSize: "18px" }}
            {...row.getToggleRowExpandedProps()}
          >
            {row.isExpanded ? "-" : "+"}
          </span>
        ),
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
      // {
      //   Header: "Agac Tipi",
      //   accessor: "",
      // },
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
    [todayTrees]
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
    visibleColumns,
  } = useTable(
    {
      columns: tableColumns,
      data: todayTrees,
    },
    useGlobalFilter,
    useExpanded
  );

  return (
    <div className="overflow-x-scroll">
      <div className="flex flex-row justify-between items-center">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <Button
          appearance={"success"}
          onClick={() => {
            try {
              if (isHaveNotFinished) {
                throw new Error("Gün sonu yapılmayanları yapınız.");
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
          className="min-w-full text-left text-sm font-light"
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
              console.log(row.original.treeStatus.treeStatusName);
              const rowBackgroundColor = () => {
                switch (row.original.treeStatus.treeStatusName) {
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
                    className={`hover:mouse-pointer text-black hover:bg-neutral-200select-none border-b  ${rowBackgroundColor()}`}
                    onClick={() => {
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
                  {row.isExpanded ? (
                    <tr>
                      <td className="pl-12 " colSpan={visibleColumns.length}>
                        {renderOrderTable({ row })}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
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
          toggle={async () => {
            setCreateLabel(false);
          }}
        />
      ) : null}
    </div>
  );
}

export default TreeTable;
