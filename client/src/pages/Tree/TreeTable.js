import React, { Fragment, useState } from "react";
import { useExpanded, useGlobalFilter, useTable } from "react-table";
import Alert from "../../components/Alert/Alert";
import GlobalFilter from "../../components/GlobalFilter/GlobalFilter";
import Input from "../../components/Input";
import Button from "../../components/Button";

function TreeTable({
  todayTrees,
  customers,
  descriptions,
  treeStatuses,
  creators,
  setClickTree,
}) {
  const [orderFilter, setOrderFilter] = useState("");
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
                      <Button appearance={"primary"}>Güncelle</Button>
                      <Button appearance={"danger"}>Sil</Button>
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
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "👇" : "👉"}
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
      // {
      //   Header: "Mum Ağırlık",
      //   accessor: "",
      // },
      // {
      //   Header: "Maden Ağırlık",
      //   accessor: "",
      // },
      {
        Header: "Oluşturma Tarihi",
        accessor: "createdAt",
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
    <div>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      {todayTrees.length > 0 ? (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                // <Fragment key={i} {...row.getRowProps()}>
                <Fragment key={i}>
                  <tr
                    align="center"
                    className="hover:mouse-pointer hover:bg-slate-800"
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
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
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
    </div>
  );
}

export default TreeTable;
