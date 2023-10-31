import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import Alert from '../../components/Alert/Alert';
import { matchSorter } from 'match-sorter';
import { DataGrid } from 'devextreme-react';
import {
  Column,
  Export,
  FilterPanel,
  FilterRow,
  HeaderFilter,
  Scrolling,
} from 'devextreme-react/data-grid';
import { statusColorStyle } from '../../utils/StatusColor';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver';

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

function OrderMain() {
  const axiosPrivate = useAxiosPrivate();

  const [newOrders, setNewOrders] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getOrders = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.ORDER, {
          signal: controller.signal,
        });

        if (isMounted) {
          var _orders = [];
          response.data.orders.rows.forEach((orderData) => {
            const orderRow = {
              orderId: orderData.orderId,
              treeNo: orderData.tree.treeNo,
              customerName: orderData.customer.customerName,
              customerAccountNumber: orderData.customer.accountNumber,
              ayar: orderData.tree.option.optionText,
              renk: orderData.tree.color.colorName,
              kalinlik: orderData.tree.thick.thickName,
              createdAt: orderData.createdAt,
              quantity: orderData.quantity,
              situation: orderData.tree.treeStatus.treeStatusName,
              active: orderData.tree.active,
              finished: orderData.tree.finished,
              isImmediate: orderData.tree.isImmediate ? true : false,
              creator: orderData.tree.creator.creatorName,
              jobGroupNo: orderData.tree.jobGroup.number,
            };
            _orders.push(orderRow);
          });
          setNewOrders(_orders);
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

  const onExcelExporting = useCallback((e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
      });
    });
  });

  return (
    <div className='overflow-x-scroll text-xs'>
      <section className='space-y-4'>
        <Header title='Siparişler' description='Siparişlerinizi bu sayfadan takip edebilirsiniz.' />
      </section>

      <div className='mt-4'>
        {newOrders.length > 0 ? (
          <Fragment>
            <DataGrid
              height={700}
              id='grid-container'
              dataSource={newOrders}
              showBorders={true}
              showRowLines={true}
              showColumnLines={true}
              allowColumnResizing={true}
              columnResizingMode={'nextColumn'}
              onExporting={onExcelExporting}
              remoteOperations={true}
              wordWrapEnabled={true}
              onRowPrepared={function (e) {
                if (e.rowType === 'data') {
                  const bgColor = statusColorStyle(e.data.situation);
                  e.rowElement.style.backgroundColor = bgColor;
                }
              }}
            >
              <FilterRow visible={true} applyFilter={'auto'} />
              <FilterPanel visible={true} />
              <HeaderFilter visible={true} />
              <Export enabled={true} allowExportSelectedData={true} />
              <Scrolling rowRenderingMode='virtual'></Scrolling>

              <Column
                width={70}
                caption={'Sipariş Id'}
                cssClass={'textCenter'}
                dataField={'orderId'}
              />
              <Column caption={'İş grubu'} dataField={'jobGroupNo'} />
              <Column width={70} caption={'A. No'} cssClass={'textCenter'} dataField={'treeNo'} />
              <Column width={200} caption={'Müşteri'} dataField={'customerName'} />
              <Column width={80} caption={'M. No'} dataField={'customerAccountNumber'} />
              <Column caption={'Ayar'} dataField={'ayar'} />
              <Column caption={'Renk'} dataField={'renk'} />
              <Column caption={'Kalınlık'} dataField={'kalinlik'} />
              <Column caption={'İşlem durumu'} dataField={'situation'} />
              <Column
                width={90}
                caption={'Aktif-Pasif'}
                dataField={'active'}
                cellRender={({ value }) =>
                  value ? (
                    <div className='bg-red-100 rounded-lg text-base text-red-700' role='alert'>
                      Evet
                    </div>
                  ) : (
                    <div className='bg-blue-100 rounded-lg text-base text-blue-700' role='alert'>
                      Hayır
                    </div>
                  )
                }
              />

              <Column
                width={90}
                caption={'Gün Sonu'}
                dataField={'finished'}
                cellRender={({ value }) =>
                  value ? (
                    <div className='bg-red-100 rounded-lg text-base text-red-700' role='alert'>
                      Evet
                    </div>
                  ) : (
                    <div className='bg-blue-100 rounded-lg text-base text-blue-700' role='alert'>
                      Hayır
                    </div>
                  )
                }
              />
              <Column
                width={90}
                caption={'Acil'}
                dataField={'isImmediate'}
                cellRender={({ value }) =>
                  value ? (
                    <div className='bg-red-100 rounded-lg text-base text-red-700' role='alert'>
                      Evet
                    </div>
                  ) : (
                    <div className='bg-blue-100 rounded-lg text-base text-blue-700' role='alert'>
                      Hayır
                    </div>
                  )
                }
              />
              <Column width={150} caption={'Hazırlayan'} dataField={'creator'} />
            </DataGrid>
          </Fragment>
        ) : (
          <Alert apperance={'danger'}>Veri bulunamadı!</Alert>
        )}
      </div>
    </div>
  );
}

export default OrderMain;
