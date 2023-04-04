import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalFilter, useTable } from "react-table";
import { FaSort } from "react-icons/fa";
import statusColor from "../../utils/StatusColor";

function CustomerTrackingPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [customersTracking, setCustomerTracking] = useState([]);

  const setCustomerTrackingData = (data) => {
    var ordered = {};
    var newArr = [];

    Object.keys(data.ordersByCustomer).forEach(function (key) {
      Object.keys(data.ordersByCustomer[key]).forEach(function (key2, index) {
        // key2 gelince yeni ordered[key] oluştur
        if (ordered[key] === undefined) {
          ordered[key] = {};
          ordered[key][key2] = data.ordersByCustomer[key][key2];
        } else {
          ordered[key + `#${index}#`] = {};
          ordered[key + `#${index}#`][key2] = data.ordersByCustomer[key][key2];
        }
        // ordered key varsa yeni bir tane daha ekle
      });
    });

    // ordered objesini sırala  key2'ye göre
    const sortedKeys = Object.keys(ordered).sort((a, b) => {
      const a2Key = Object.keys(ordered[a])[0]; // birinci veya ikinci anahtar
      const b2Key = Object.keys(ordered[b])[0]; // birinci veya ikinci anahtar
      return a2Key.localeCompare(b2Key); // 2. anahtara göre karşılaştır
    });
    const sortedObj = {};
    for (let key of sortedKeys) {
      sortedObj[key] = ordered[key];
    }

    Object.keys(sortedObj).forEach(function (key) {
      Object.keys(sortedObj[key]).forEach(function (key2) {
        let newArrItem = {
          accountNumber: sortedObj[key][key2][0]["customer"]["accountNumber"],
          customer: key.slice(
            0,
            key.indexOf("#") === -1 ? key.length : key.indexOf("#")
          ),
          option: key2,
        };

        Object.keys(sortedObj[key][key2]).forEach(function (key3) {
          // tree color'a göre grupla
          const colorName =
            sortedObj[key][key2][key3]["tree"]["color"]["colorName"];

          if (newArrItem[colorName] === undefined) {
            newArrItem[colorName] = [];
          }
          newArrItem[colorName].push(sortedObj[key][key2][key3]);
        });
        newArr.push(newArrItem);
      });
    });
    console.log(newArr);
    setCustomerTracking(newArr);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCustomerTracking = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.CUSTOMERTRACKING, {
          signal: controller.signal,
        });
        isMounted && setCustomerTrackingData(response.data);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getCustomerTracking();
    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);
  const tableColumns = useMemo(
    () => [
      {
        Header: "Hesap No",
        accessor: "accountNumber",
      },
      {
        Header: "Müşteri",
        accessor: "customer",
      },
      {
        Header: "Ayar",
        accessor: "option",
      },
      {
        Header: "Beyaz Ağaç",
        accessor: "",
        Cell: ({ row }) => {
          if (row.original?.Beyaz !== undefined) {
            return row.original.Beyaz.map((item) => {
              // son item değilse
              var borderClass = "";
              if (
                row.original.Beyaz.indexOf(item) !==
                row.original.Beyaz.length - 1
              ) {
                borderClass =
                  "border-b  border-dashed border-spacing-2 border-black";
              }
              return (
                <div
                  className={`d-flex flex-col justify-between ${borderClass} py-2 ${statusColor(
                    item.tree.treeStatus.treeStatusName
                  )}`}
                >
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${
                    item.tree.treeStatus.treeStatusName
                  }, Urun Miktarı = ${
                    item.quantity
                  }, Islem Tarihi = ${item.updatedAt.slice(0, 10)}`}
                </div>
              );
            });
          }
        },
      },
      {
        Header: "Kırmızı Ağaç",
        accessor: "",
        Cell: ({ row }) => {
          if (row.original?.Kırmızı !== undefined) {
            return row.original.Kırmızı.map((item) => {
              // son item değilse
              var borderClass = "";
              if (
                row.original.Kırmızı.indexOf(item) !==
                row.original.Kırmızı.length - 1
              ) {
                borderClass =
                  "border-b  border-dashed border-spacing-2 border-black";
              }
              return (
                <div
                  className={`d-flex flex-col justify-between ${borderClass} py-2`}
                >
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${
                    item.tree.treeStatus.treeStatusName
                  }, Urun Miktarı = ${
                    item.quantity
                  }, Islem Tarihi = ${item.updatedAt.slice(0, 10)}`}
                </div>
              );
            });
          }
        },
      },
      {
        Header: "Yeşil Ağaç",
        accessor: "",
        Cell: ({ row }) => {
          if (row.original?.Yeşil !== undefined) {
            return row.original.Yeşil.map((item) => {
              var borderClass = "";
              if (
                row.original.Yeşil.indexOf(item) !==
                row.original.Yeşil.length - 1
              ) {
                borderClass =
                  "border-b  border-dashed border-spacing-2 border-black";
              }
              return (
                <div
                  className={`d-flex flex-col justify-between ${borderClass} py-2`}
                >
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${
                    item.tree.treeStatus.treeStatusName
                  }, Urun Miktarı = ${
                    item.quantity
                  }, Islem Tarihi = ${item.updatedAt.slice(0, 10)}`}
                </div>
              );
            });
          }
        },
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
    { columns: tableColumns, data: customersTracking },
    useGlobalFilter
  );

  console.log(customersTracking);

  return (
    <div className="space-y-4">
      <Header
        title={"Müşteri Takip"}
        description={"Müşterilerinin takibini gerçekleştir"}
      />
      <div className="overflow-x-scroll">
        {customersTracking?.length > 0 ? (
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
            <tbody
              {...getTableBodyProps()}
              className="divide-y divide-gray-200 "
            >
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
      </div>
    </div>
  );
}

export default CustomerTrackingPage;
