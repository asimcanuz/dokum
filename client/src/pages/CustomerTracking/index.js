import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGlobalFilter, useTable } from 'react-table';
import { FaSort } from 'react-icons/fa';
import { statusColorStyle } from '../../utils/StatusColor';
import Alert from '../../components/Alert/Alert';
import Select from 'react-select';
import GlobalFilter from '../../components/GlobalFilter/GlobalFilter';

function CustomerTrackingPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [customersTracking, setCustomerTracking] = useState([]);
  const [jobGroups, setJobGroups] = useState([]);
  const [selectedJobGroup, setSelectedJobGroup] = useState('');
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
          accountNumber: sortedObj[key][key2][0]['customer']['accountNumber'],
          customer: key.slice(0, key.indexOf('#') === -1 ? key.length : key.indexOf('#')),
          option: key2,
        };

        Object.keys(sortedObj[key][key2]).forEach(function (key3) {
          // tree color'a göre grupla
          const colorName = sortedObj[key][key2][key3]['tree']['color']['colorName'];

          if (newArrItem[colorName] === undefined) {
            newArrItem[colorName] = [];
          }

          if (newArrItem[colorName].length > 0) {
            //treeId aynıysa quantity'yi topla
            if (
              newArrItem[colorName][newArrItem[colorName].length - 1].tree.treeId ===
              sortedObj[key][key2][key3].tree.treeId
            ) {
              newArrItem[colorName][newArrItem[colorName].length - 1].quantity +=
                sortedObj[key][key2][key3].quantity;
              return;
            }
          }
          newArrItem[colorName].push(sortedObj[key][key2][key3]);
        });
        newArr.push(newArrItem);
      });
    });
    setCustomerTracking(newArr);
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getJobGroups = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.JOBGROUP, {
          signal: controller.signal,
        });

        isMounted && setJobGroups(response.data.jobGroupList);
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    const getCustomerTracking = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.CUSTOMERTRACKING, {
          params: {
            jobGroupId: selectedJobGroup,
          },
          signal: controller.signal,
        });
        isMounted && setCustomerTrackingData(response.data);
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };
    getJobGroups();

    var interval = null;
    if (selectedJobGroup !== '') {
      getCustomerTracking();
      interval = setInterval(() => {
        getCustomerTracking();
      }, 20000);
    }

    return () => {
      isMounted = false;
      isMounted && controller.abort();
      clearInterval(interval);
    };
  }, [selectedJobGroup]);

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Hesap No',
        accessor: 'accountNumber',
      },
      {
        Header: 'Müşteri',
        accessor: 'customer',
      },
      {
        Header: 'Ayar',
        accessor: 'option',
      },
      {
        Header: 'Beyaz Ağaç',
        accessor: '',
        Cell: ({ row }) => {
          if (row.original?.Beyaz !== undefined) {
            return row.original.Beyaz.map((item) => {
              // son item değilse
              var borderClass = '';
              if (row.original.Beyaz.indexOf(item) !== row.original.Beyaz.length - 1) {
                borderClass = 'border-b  border-dashed border-spacing-2 border-black';
              }
              return (
                <div className={`d-flex flex-col justify-between ${borderClass} py-2 }`}>
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${
                    item.tree.treeStatus.treeStatusName
                  }, Urun Miktarı = ${item.quantity}, Islem Tarihi = ${item.updatedAt.slice(
                    0,
                    10,
                  )}`}
                </div>
              );
            });
          }
        },
      },
      {
        Header: 'Kırmızı Ağaç',
        accessor: '',
        Cell: ({ row }) => {
          if (row.original?.Kırmızı !== undefined) {
            return row.original.Kırmızı.map((item) => {
              // son item değilse
              var borderClass = '';
              if (row.original.Kırmızı.indexOf(item) !== row.original.Kırmızı.length - 1) {
                borderClass = 'border-b  border-dashed border-spacing-2 border-black';
              }
              return (
                <div className={`d-flex flex-col justify-between ${borderClass} py-2`}>
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${
                    item.tree.treeStatus.treeStatusName
                  }, Urun Miktarı = ${item.quantity}, Islem Zamanı = ${item.updatedAt.slice(
                    0,
                    10,
                  )}`}
                </div>
              );
            });
          }
        },
      },
      {
        Header: 'Yeşil Ağaç',
        accessor: '',
        Cell: ({ row }) => {
          if (row.original?.Yeşil !== undefined) {
            return row.original.Yeşil.map((item) => {
              var borderClass = '';
              if (row.original.Yeşil.indexOf(item) !== row.original.Yeşil.length - 1) {
                borderClass = 'border-b  border-dashed border-spacing-2 border-black';
              }
              return (
                <div className={`d-flex flex-col justify-between ${borderClass} py-2`}>
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${
                    item.tree.treeStatus.treeStatusName
                  }, Urun Miktarı = ${item.quantity}, Islem Tarihi = ${item.updatedAt.slice(
                    0,
                    10,
                  )}`}
                </div>
              );
            });
          }
        },
      },
    ],
    [customersTracking, selectedJobGroup],
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
      data: customersTracking,
      autoResetExpanded: false,
      autoResetGlobalFilter: false,
      autoResetAll: false,
    },
    useGlobalFilter,
  );

  const getCellColor = (statusArray) => {
    if (statusArray.includes('Hazırlanıyor')) {
      return statusColorStyle('Hazırlanıyor');
    } else if (statusArray.includes('Dökümde')) {
      return statusColorStyle('Dökümde');
    } else if (statusArray.includes('Döküldü')) {
      return statusColorStyle('Döküldü');
    } else if (statusArray.includes('Kesimde')) {
      return statusColorStyle('Kesimde');
    } else {
      return statusColorStyle('');
    }
  };
  const jobGroupOptions = useMemo(() => {
    return jobGroups.map((jobGroup) => {
      return {
        value: jobGroup.id,
        label: 'No: ' + jobGroup.number + ' (' + jobGroup.date + ')',
      };
    });
  }, [jobGroups]);

  const getJobGroupValue = () => {
    if (selectedJobGroup !== '') {
      return jobGroupOptions.find((option) => option.value === selectedJobGroup);
    } else {
      return null;
    }
  };

  return (
    <div className='space-y-4'>
      <Header title={'Müşteri Takip'} description={'Müşterilerinin takibini gerçekleştir'} />
      <Select
        className='w-1/2'
        value={getJobGroupValue()}
        options={jobGroupOptions}
        onChange={(e) => {
          setSelectedJobGroup(e.value);
        }}
      />
      <div className='overflow-x-scroll'>
        {customersTracking?.length > 0 ? (
          <div>
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
            <table
              {...getTableProps()}
              className='min-w-full divide-y divide-gray-200 mt-2 border-collapse border border-slate-500'
            >
              <thead className='bg-gray-50'>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className='py-3 text-xs font-bold text-left text-gray-500 uppercase border border-slate-600 '
                      >
                        <div className='flex flex-1 items-center'>
                          {column.render('Header')}
                          {column.isSorted ? <FaSort className='text-xs ml-4' /> : ''}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()} className='divide-y divide-gray-200 '>
                {rows.map((row) => {
                  prepareRow(row);

                  return (
                    <tr
                      {...row.getRowProps()}
                      className={`px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap `}
                    >
                      {row.cells.map((cell) => {
                        let backgroundColor = '';
                        if (
                          cell.column.Header.split(' ')[0] === 'Kırmızı' &&
                          row.original['Kırmızı'] !== undefined &&
                          row.original['Kırmızı'].length > 0
                        ) {
                          let arr = [];
                          row.original['Kırmızı'].forEach((item) => {
                            const { treeStatusName } = item.tree.treeStatus;
                            arr.push(treeStatusName);
                          });
                          backgroundColor = getCellColor(arr);
                        }
                        if (
                          cell.column.Header.split(' ')[0] === 'Beyaz' &&
                          row.original['Beyaz'] !== undefined &&
                          row.original['Beyaz'].length > 0
                        ) {
                          let arr = [];

                          row.original['Beyaz'].forEach((item) => {
                            const { treeStatusName } = item.tree.treeStatus;
                            arr.push(treeStatusName);
                          });
                          backgroundColor = getCellColor(arr);
                        }
                        if (
                          cell.column.Header.split(' ')[0] === 'Yeşil' &&
                          row.original['Yeşil'] !== undefined &&
                          row.original['Yeşil'].length > 0
                        ) {
                          let arr = [];

                          row.original['Yeşil'].forEach((item) => {
                            const { treeStatusName } = item.tree.treeStatus;
                            arr.push(treeStatusName);
                          });
                          backgroundColor = getCellColor(arr);
                        }

                        return (
                          <td
                            {...cell.getCellProps({
                              style: {
                                width: cell.column.width,
                                backgroundColor: backgroundColor,
                              },
                            })}
                            className='border border-slate-200 '
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <Alert apperance={'danger'}>Aktif Ağaç bulunamadı</Alert>
        )}
      </div>
    </div>
  );
}

export default CustomerTrackingPage;
