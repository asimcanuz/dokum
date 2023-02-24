import React from "react";
import { useExpanded, useGlobalFilter, useTable } from "react-table";
import Alert from "../../components/Alert/Alert";
import GlobalFilter from "../../components/GlobalFilter/GlobalFilter";

function TreeTable({ todayTrees }) {
  const tableColumns = React.useMemo(
    () => [
      {
        // Build our expander column
        id: "expander", // Make sure it has an ID
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
          <span {...getToggleAllRowsExpandedProps()}>
            {isAllRowsExpanded ? "👇" : "👉"}
          </span>
        ),
        Cell: ({ row }) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? "👇" : "👉"}
            </span>
          ) : null,
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
      },
      {
        Header: "Agac Tipi",
        accessor: "",
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
        Header: "Mum Ağırlık",
        accessor: "",
      },
      {
        Header: "Maden Ağırlık",
        accessor: "",
      },
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
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
