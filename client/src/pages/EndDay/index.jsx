import React, { Fragment, useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import { useGlobalFilter, useTable } from "react-table";
import Alert from "../../components/Alert/Alert";
import CheckBox from "../../components/Input/CheckBox";
import GlobalFilter from "../../components/GlobalFilter/GlobalFilter";
import Button from "../../components/Button";
import ReactDatePicker from "react-datepicker";

function EndDayMain() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [trees, setTrees] = useState([]);
  const [selectedTrees, setSelectedTrees] = useState([]);

  const tableColumns = useMemo(
    () => [
      {
        Header: "",
        accessor: "finished",
        Cell: ({ value, row }) => {
          return (
            <CheckBox
              id={row.original.treeId}
              value={value}
              onChange={(e) => {
                if (e.target.checked) {
                  selectedTrees.push(row.original.treeId);
                  setSelectedTrees([...selectedTrees]);
                } else {
                  const index = selectedTrees.indexOf(row.original.treeId);
                  if (index > -1) {
                    selectedTrees.splice(index, 1);
                    setSelectedTrees([...selectedTrees]);
                  }
                }
              }}
            />
          );
        },
      },
      { Header: "Ağaç Id", accessor: "treeId" },
      { Header: "Ağaç No", accessor: "treeNo" },
      { Header: "Liste No", accessor: "listNo" },
      { Header: "Kalınlık", accessor: "thick.thickName" },
      { Header: "Renk", accessor: "color.colorName" },
      { Header: "Seçenek", accessor: "option.optionText" },
      { Header: "Wax", accessor: "wax.waxName" },
      {
        Header: "Durum",
        accessor: "treeStatus.treeStatusName",
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
          return <span className={cn}>{row.value}</span>;
        },
      },
      {
        Header: "Tarih",
        accessor: "date",
        Cell: ({ value, row }) => {
          // date picker for update
          return (
            <ReactDatePicker
              selected={new Date(value)}
              dateFormat="dd/MM/yyyy"
              onChange={(date) => {
                setTrees(
                  trees.map((tree) => {
                    if (tree.treeId === row.original.treeId) {
                      return { ...tree, date: date };
                    }
                    return tree;
                  })
                );

                let dateUpdate = axiosPrivate.put(
                  Endpoints.FINISHDAY + "/date",
                  {
                    treeId: row.original.treeId,
                    date: date,
                  }
                );

                Promise.all([dateUpdate]).then(() => {
                  getTrees();
                });
              }}
            />
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getTrees = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.FINISHDAY, {
          signal: controller.signal,
        });

        setTrees(res.data.trees);
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getTrees();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  const getTrees = async () => {
    const controller = new AbortController();
    try {
      const res = await axiosPrivate.get(Endpoints.FINISHDAY);
      setTrees(res.data.trees);
    } catch (error) {
      console.error(error);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

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
  } = useTable({ columns: tableColumns, data: trees }, useGlobalFilter);

  return (
    <Fragment>
      <section className="space-y-4">
        <Header
          title={"Gün Sonu"}
          description={"Gün sonu işlemlerini buradan yapabilirsiniz."}
        />
      </section>
      <div className="mt-4 ">
        {trees.length > 0 && (
          <div className="  flex flex-row items-center justify-between">
            <Button
              disabled={selectedTrees.length === 0}
              appearance={"primary"}
              onClick={() => {
                let update = axiosPrivate.put(Endpoints.FINISHDAY, {
                  treeIds: selectedTrees,
                });

                Promise.all([update]).then(() => {
                  getTrees();
                });
              }}
            >
              Gün Sonu Yap
            </Button>
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        )}
        {trees.length > 0 ? (
          <table
            {...getTableProps()}
            className="min-w-full text-left text-sm font-light mt-6"
          >
            <thead className="border-b font-medium dark:border-neutral-500 bg-gray-50">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="py-2 px-4">
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                const rowBackgroundColor = () => {
                  // day Format: 2022-01-01
                  if (
                    row.original.date === new Date().toISOString().split("T")[0]
                  ) {
                    return "bg-blue-50";
                  }
                };
                return (
                  <tr
                    {...row.getRowProps()}
                    className={` text-left hover:mouse-pointer text-black hover:bg-neutral-200 select-none border-b ${rowBackgroundColor()} `}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()} className="py-2 px-4">
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
          <Alert>Bütün Ağaçlar Gün Sonu yapılmış</Alert>
        )}
      </div>
    </Fragment>
  );
}

export default EndDayMain;