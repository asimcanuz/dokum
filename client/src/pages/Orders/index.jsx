import React, { Fragment, useEffect, useState } from 'react';
import Header from '../../components/Header';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useGlobalFilter, usePagination, useTable, useFilters } from 'react-table';
import Alert from '../../components/Alert/Alert';
import ReactSelect from 'react-select';
import { matchSorter } from 'match-sorter';

function SelectColumnFilter({ column: { filterValue, setFilter, preFilteredRows, id } }) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  let selectOptions = [{ value: '', label: 'Hepsi' }];

  options.forEach((opts) => {
    selectOptions.push({
      label: opts,
      value: opts,
    });
  });

  return (
    <select
      className='block w-full px-1 py-0.5 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value=''>Hepsi</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function BooleanFilter({ column: { filterValue, setFilter } }) {
  // Calculate the options for filtering
  // using the preFilteredRows

  let selectOptions = [{ value: '', label: 'Hepsi' }];

  return (
    <select
      className='block w-full px-1 py-0.5 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value=''>Hepsi</option>
      <option value='true'>Evet</option>
      <option value='false'>Hayır</option>
    </select>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function OrderMain() {
  const axiosPrivate = useAxiosPrivate();

  const [orders, setOrders] = useState([]);

  const tableColumns = React.useMemo(
    () => [
      {
        Header: 'Sipariş ID',
        accessor: 'orderId',
        filterable: false,
      },
      {
        Header: 'Agac No',
        accessor: 'treeId',
        filterable: true,
        Filter: SelectColumnFilter,
      },
      {
        Header: 'Liste No',
        accessor: 'tree.listNo',
        filterable: false,
      },
      {
        Header: 'Hesap No',
        accessor: 'customer.accountNumber',
        filterable: false,
      },
      {
        Header: 'Müşteri Adı',
        accessor: 'customer.customerName',
        Filter: SelectColumnFilter,
        filterable: true,
      },
      {
        Header: 'Ayar',
        accessor: 'tree.option.optionText',
        filterable: true,
        Filter: SelectColumnFilter,
      },
      {
        Header: 'Renk',
        accessor: 'tree.color.colorName',
        filterable: true,
        Filter: SelectColumnFilter,
      },
      {
        Header: 'Kalınlık',
        accessor: 'tree.thick.thickName',
        filterable: true,
        Filter: SelectColumnFilter,
      },
      {
        Header: 'Açıklama',
        accessor: 'description.descriptionText',
        filterable: false,
      },
      {
        Header: 'Döküm Tarihi',
        accessor: 'tree.date',
        filterable: true,
        Filter: SelectColumnFilter,
      },
      {
        Header: 'Adet',
        accessor: 'quantity',
      },
      {
        Header: 'İşlem Durumu',
        accessor: 'tree.treeStatus.treeStatusName',
        Cell: (row) => {
          const rowBackgroundColor = () => {
            switch (row.value) {
              case 'Hazırlanıyor':
                return 'bg-yellow-200';
              case 'Dökümde':
                return 'bg-green-200';
              case 'Döküldü':
                return 'bg-blue-200';
              case 'Kesimde':
                return 'bg-purple-200';
              default:
                return 'bg-white';
            }
          };
          const cn =
            rowBackgroundColor() + ' text-center text-sm font-semibold p-1 rounded w-32 mx-auto';
          return <div className={cn}>{row.value}</div>;
        },
        filterable: true,
        Filter: SelectColumnFilter,
      },

      {
        Header: 'Aktif-Pasif',
        accessor: 'tree.active',
        Cell: (row) => {
          let cn = row.value ? 'bg-green-700' : 'bg-red-500';
          cn += ' text-white p-1 rounded text-sm font-semibold text-center w-16 mx-auto ';
          return <div className={cn}>{row.value ? 'Aktif' : 'Pasif'}</div>;
        },
        filterable: true,
        Filter: BooleanFilter,
      },
      {
        Header: 'Gün Sonu',
        accessor: 'tree.finished',
        Cell: (row) => {
          let cn = row.value ? 'bg-green-700' : 'bg-red-500';
          cn += ' text-white p-1 rounded text-sm font-semibold text-center w-16 ';
          return <div className={cn}>{row.value ? 'Evet' : 'Hayır'}</div>;
        },
        filterable: true,
        Filter: BooleanFilter,
      },
      {
        Header: 'Acil Mi',
        accessor: 'isImmediate',
        Cell: (row) => {
          let cn = row.value ? 'bg-green-700' : 'bg-red-500';
          cn += ' text-white p-1 rounded text-sm font-semibold text-center w-16 mx-auto ';
          return <div className={cn}>{row.value ? 'Evet' : 'Hayır'}</div>;
        },
        filterable: true,
        Filter: BooleanFilter,
      },
      {
        Header: 'Hazırlayan',
        accessor: 'tree.creator.creatorName',
        filterable: true,
        Filter: SelectColumnFilter,
      },
    ],

    [orders],
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
    prepareRow,
    state,
    page,

    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    
  } = useTable(
    {
      columns: tableColumns,
      data: orders,
    },
    useFilters,
    useGlobalFilter,
    usePagination,
  );

  return (
    <div className='overflow-x-scroll text-xs'>
      <section className='space-y-4'>
        <Header title='Siparişler' description='Siparişlerinizi bu sayfadan takip edebilirsiniz.' />
      </section>

      <div className='mt-4'>
        {orders.length > 0 ? (
          <div>
            <table {...getTableProps()} className='min-w-full text-left text-sm font-light'>
              <thead className='border-b font-medium dark:border-neutral-500 bg-gray-50'>
                {headerGroups.map((headerGroup, i) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                    {headerGroup.headers.map((column) => (
                      <th scope='col' className='px-6 py-4' {...column.getHeaderProps()}>
                        {column.render('Header')}
                        <div>{column.filterable ? column.render('Filter') : null}</div>
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
                      case 'Hazırlanıyor':
                        return 'bg-yellow-100';
                      case 'Dökümde':
                        return 'bg-green-100';
                      case 'Döküldü':
                        return 'bg-blue-100';
                      case 'Kesimde':
                        return 'bg-purple-100';
                      default:
                        return 'bg-white';
                    }
                  };
                  return (
                    // <Fragment key={i} {...row.getRowProps()}>
                    <Fragment key={i}>
                      <tr
                        align='center'
                        className={` text-left hover:mouse-pointer text-black hover:bg-neutral-200 select-none border-b  ${rowBackgroundColor()}`}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td className='whitespace-nowrap px-6 py-4' {...cell.getCellProps()}>
                              {cell.render('Cell')}
                            </td>
                          );
                        })}
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>

            <div className='flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4'>
              <div className='w-full  flex items-center justify-between border-t border-gray-200'>
                <div
                  className='flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer'
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <svg
                    width='14'
                    height='8'
                    viewBox='0 0 14 8'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1.1665 4H12.8332'
                      stroke='currentColor'
                      strokeWidth='1.25'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M1.1665 4L4.49984 7.33333'
                      stroke='currentColor'
                      strokeWidth='1.25'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M1.1665 4.00002L4.49984 0.666687'
                      stroke='currentColor'
                      strokeWidth='1.25'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  <p className='text-sm ml-3 font-medium leading-none '>Önceki</p>
                </div>
                <div className='sm:flex hidden'>
                  {pageOptions.map((page, i) => {
                    let activePage = null;
                    if (page === state.pageIndex) {
                      activePage = 'text-indigo-700 border-indigo-400';
                    }

                    return (
                      <p
                        key={i}
                        className={`text-sm font-medium leading-none cursor-pointer text-gray-600 hover:text-indigo-700 border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2 ${activePage}`}
                        onClick={() => gotoPage(page)}
                      >
                        {page + 1}
                      </p>
                    );
                  })}
                </div>
                <div
                  className='flex items-center pt-3 text-gray-600 hover:text-indigo-700 cursor-pointer'
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  <p className='text-sm font-medium leading-none mr-3'>Sonraki</p>
                  <svg
                    width='14'
                    height='8'
                    viewBox='0 0 14 8'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M1.1665 4H12.8332'
                      stroke='currentColor'
                      strokeWidth='1.25'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M9.5 7.33333L12.8333 4'
                      stroke='currentColor'
                      strokeWidth='1.25'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M9.5 0.666687L12.8333 4.00002'
                      stroke='currentColor'
                      strokeWidth='1.25'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Alert apperance={'danger'}>Veri bulunamadı!</Alert>
        )}
      </div>
    </div>
  );
}

export default OrderMain;
