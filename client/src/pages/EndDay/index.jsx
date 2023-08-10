import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Header from '../../components/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useGlobalFilter, useTable } from 'react-table';
import Alert from '../../components/Alert/Alert';
import CheckBox from '../../components/Input/CheckBox';
import GlobalFilter from '../../components/GlobalFilter/GlobalFilter';
import Button from '../../components/Button';
import Select from 'react-select';
import moment from 'moment/moment';
import ErrorModal from '../../components/ErrorModal';
import NewListNo from './NewListNo';

function EndDayMain() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [trees, setTrees] = useState([]);
  const [selectedTrees, setSelectedTrees] = useState([]);
  const [jobGroups, setJobGroups] = useState([]);
  const [selectedJobGroup, setSelectedJobGroup] = useState('');
  const [openTreeNoModal, setOpenTreeNoModal] = useState(0);
  const [replaceJobGroup, setReplaceJobGroup] = useState('');
  const [replacedTree, setReplacedTree] = useState();
  const tableColumns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'finished',
        Cell: ({ value, row }) => {
          return (
            <CheckBox
              id={row.original.treeId}
              checked={selectedTrees.includes(row.original.treeId)}
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

      {
        Header: 'İş Grubu',
        accessor: 'jobGroup?.number',
        Cell: ({ row }) => {
          return (
            <div>
              {jobGroups.length > 1 ? (
                <Select
                  className='w-full '
                  options={jobGroupOptions}
                  value={jobGroupOptions.find(
                    (option) => option.value === Number(row?.original?.jobGroupId),
                  )}
                  onChange={(e) => {
                    setReplaceJobGroup(e.value);
                    setOpenTreeNoModal(true);
                    setReplacedTree(row.original);
                  }}
                />
              ) : (
                <span>{jobGroups[0].number}</span>
              )}
            </div>
          );
        },
      },
      { Header: 'Ağaç Id', accessor: 'treeId' },
      { Header: 'Ağaç No', accessor: 'treeNo' },
      { Header: 'Liste No', accessor: 'listNo' },
      { Header: 'Kalınlık', accessor: 'thick.thickName' },
      { Header: 'Renk', accessor: 'color.colorName' },
      { Header: 'Seçenek', accessor: 'option.optionText' },
      { Header: 'Wax', accessor: 'wax.waxName' },
      {
        Header: 'Tarih',
        accessor: 'date',
        Cell: ({ value }) => {
          return <div>{moment(value).format('DD-MM-YYYY')}</div>;
        },
      },
      {
        Header: 'Durum',
        accessor: 'treeStatus.treeStatusName',
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
          return <span className={cn}>{row.value}</span>;
        },
      },
    ],
    [jobGroups],
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getTrees = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.FINISHDAY, {
          params: {
            jobGroupId: selectedJobGroup,
          },
          signal: controller.signal,
        });

        setTrees(res.data.trees);
      } catch (error) {
        console.error(error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };
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

    getJobGroups();
    selectedJobGroup !== '' && getTrees();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedJobGroup]);
  const getTrees = async () => {
    const controller = new AbortController();
    try {
      const res = await axiosPrivate.get(Endpoints.FINISHDAY, {
        params: {
          jobGroupId: selectedJobGroup,
        },
      });
      setTrees(res.data.trees);
    } catch (error) {
      console.error(error);
      navigate('/login', { state: { from: location }, replace: true });
    }
  };
  const getJobGroups = async () => {
    try {
      const response = await axiosPrivate.get(Endpoints.JOBGROUP);
      setJobGroups(response.data.jobGroupList);
    } catch (err) {
      console.error(err);
      navigate('/login', { state: { from: location }, replace: true });
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

  const jobGroupOptions = useMemo(() => {
    return jobGroups.map((jobGroup) => {
      return {
        value: jobGroup.id,
        label: 'No: ' + jobGroup.number,
      };
    });
  }, [jobGroups]);
  const jobGroupRef = useRef(null);
  const getJobGroupValue = () => {
    if (selectedJobGroup !== '') {
      return jobGroupOptions.find((option) => option.value === selectedJobGroup);
    } else {
      return null;
    }
  };
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: '',
  });

  const finishDay = () => {
    try {
      const finishTrees = trees.filter((tree) => selectedTrees.includes(tree.treeId));

      finishTrees.forEach((tree) => {
        if (
          tree.treeStatus.treeStatusName === 'Hazırlanıyor' ||
          tree.treeStatus.treeStatusName === 'Dökümde'
        ) {
          throw new Error('Durumu hazırlanıyor veya dökümde olan ağaçları gün sonu yapamazsınız!');
        }
      });
      finishTrees.forEach((tree) => {
        let update = axiosPrivate.put(Endpoints.FINISHDAY, {
          treeIds: selectedTrees,
        });
        Promise.all([update]).then(() => {
          getTrees();
        });
      });
    } catch (error) {
      setErrorModal({
        visible: true,
        message: error.message,
        title: 'Gün Sonu Hatası',
      });
    }
  };
  const finishDayAll = () => {
    try {
      trees.forEach((tree) => {
        if (
          tree.treeStatus.treeStatusName === 'Hazırlanıyor' ||
          tree.treeStatus.treeStatusName === 'Dökümde'
        ) {
          throw new Error(
            'Durumu hazırlanıyor veya dökümde olan ağaçlarınız vardır. İş grubunu kapatamazsınız!',
          );
        }
      });
      let update = axiosPrivate.put(Endpoints.FINISHDAY + '/all', {
        jobGroupId: selectedJobGroup,
      });
      Promise.all([update]).then(() => {
        setSelectedJobGroup('');
        getJobGroups();
        setTrees([]);
      });
    } catch (error) {
      setErrorModal({
        visible: true,
        message: error.message,
        title: 'Gün Sonu Hatası',
      });
    }
  };

  return (
    <Fragment>
      <section className='space-y-4'>
        <Header title={'Gün Sonu'} description={'Gün sonu işlemlerini buradan yapabilirsiniz.'} />
      </section>
      <Select
        ref={jobGroupRef}
        className='w-1/2'
        value={getJobGroupValue()}
        options={jobGroupOptions}
        onChange={(e) => {
          setSelectedJobGroup(e.value);
        }}
      />
      <div className='mt-4 space-y-4'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row w-1/2 space-x-12'>
            {trees.length > 0 && (
              <Button
                disabled={selectedTrees.length === 0}
                appearance={'primary'}
                onClick={() => {
                  finishDay();
                }}
              >
                Gün Sonu Yap
              </Button>
            )}
            <Button
              appearance={'primary'}
              disabled={selectedJobGroup === ''}
              onClick={() => {
                finishDayAll();
              }}
            >
              İş Grubunu Kapat
            </Button>
          </div>

          {trees.length > 0 && (
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          )}
        </div>

        {selectedJobGroup !== '' ? (
          trees.length > 0 ? (
            <table {...getTableProps()} className='min-w-full text-left text-sm font-light mt-6'>
              <thead className='border-b font-medium dark:border-neutral-500 bg-gray-50'>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} className='py-2 px-4'>
                        {column.render('Header')}
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
                    if (row.original.date === new Date().toISOString().split('T')[0]) {
                      return 'bg-blue-50';
                    }
                  };
                  return (
                    <tr
                      {...row.getRowProps()}
                      className={` text-left hover:mouse-pointer text-black hover:bg-neutral-200 select-none border-b ${rowBackgroundColor()} `}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()} className='py-2 px-4'>
                            {cell.render('Cell')}
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
          )
        ) : (
          <Alert apperance={'danger'}>İş Grubu Seçiniz</Alert>
        )}
      </div>
      {errorModal.visible && (
        <ErrorModal
          title={errorModal.title}
          visible={errorModal.visible}
          onCancel={() => {
            setErrorModal({
              message: '',
              title: '',
              visible: false,
            });
            setSelectedTrees([]);
          }}
        >
          <p>{errorModal.message}</p>
        </ErrorModal>
      )}
      {openTreeNoModal ? (
        <NewListNo
          open={openTreeNoModal}
          toggle={() => {
            setOpenTreeNoModal(false);
          }}
          replaceJobGroup={replaceJobGroup}
          replacedTree={replacedTree}
          getTrees={getTrees}
        />
      ) : null}
    </Fragment>
  );
}

export default EndDayMain;
