import React from "react";
import { FaSort } from "react-icons/fa";
import styles from "./Table.module.css";

function Table({
  getTableProps,
  headerGroups,
  getTableBodyProps,
  rows,
  prepareRow,
}) {
  return (
    <>
      <table {...getTableProps()} className={styles.table}>
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
                    {column.isSorted ? <FaSort className="text-xs ml-4" /> : ""}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
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
    </>
  );
}

export default Table;
