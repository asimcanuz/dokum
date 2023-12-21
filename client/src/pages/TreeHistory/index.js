import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import Alert from '../../components/Alert/Alert';
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

function TreeHistory() {
  const axiosPrivate = useAxiosPrivate();

  const [trees, setTrees] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getTrees = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.TREE.MAIN, {
          signal: controller.signal,
        });
        if (isMounted) {
          console.log(response.data);
          const _trees = response.data.trees.map((tree) => {
            var agacTipi = '';
            if (Object.keys(tree.orders).length > 0) {
              let name = tree.orders[0].customer.customerName;
              let shuffle = false;
              tree.orders.forEach((order) => {
                if (order.customer.customerName !== name) {
                  shuffle = true;
                }
              });
              if (shuffle) {
                agacTipi = 'Karma';
              } else {
                agacTipi = name;
              }
            } else {
              agacTipi = '-';
            }
            return {
              aktif: tree.active,
              renk: tree.color.colorName,
              olusturmaTarihi: tree.date,
              hazirlayan: tree.creator.creatorName,
              musteriAdet: tree.customerQuantity,
              firinlandiMi: tree.yerlestigiFirin !== null,
              firinId: tree.yerlestigiFirin,
              acilMi: tree.isImmediate,
              isGrubu: tree.jobGroup.number,
              ayar: tree.option.optionText,
              kalinlik: tree.thick.thickName,
              agacNumarasi: tree.treeNo,
              madenAgirligi: tree.mineralWeight,
              mumAgirligi: tree.waxWeight,
              gunSonuYapildiMi: tree.isFinished,
              durum: tree.treeStatus.treeStatusName,
      
              agacTipi,
            };
          });
          setTrees(_trees);
        }
      } catch (err) {
        console.log(err);
      }
    };
    isMounted && getTrees();

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
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'AgacListesi.xlsx');
      });
    });
  });

  return (
    <div className='space-y-4 h-full'>
      <Header title={'Ağaç Listesi'} description={''} />
      <div className='mt-4'>
        {trees.length > 0 ? (
          <Fragment>
            <DataGrid
              height={700}
              id='grid-container'
              dataSource={trees}
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
                  const bgColor = statusColorStyle(e.data.durum);
                  e.rowElement.style.backgroundColor = bgColor;
                }
              }}
            >
              <FilterRow visible={true} applyFilter={'auto'} />
              <FilterPanel visible={true} />
              <HeaderFilter visible={true} />
              <Export enabled={true} allowExportSelectedData={true} />
              <Scrolling rowRenderingMode={'virtual'}></Scrolling>
              <Column
                width={70}
                caption={'A. No'}
                cssClass={'textCenter'}
                dataField={'agacNumarasi'}
              />
              <Column caption={'İş Grubu'} cssClass={'textCenter'} dataField={'isGrubu'} />
              <Column caption={'Ayar'} cssClass={'textCenter'} dataField={'ayar'} />
              <Column caption={'Renk'} cssClass={'textCenter'} dataField={'renk'} />
              <Column caption={'Kalınlık'} cssClass={'textCenter'} dataField={'kalinlik'} />
              <Column
                caption={'Maden Ağırlığı'}
                cssClass={'textCenter'}
                dataField={'madenAgirligi'}
              />
              <Column caption={'Mum Ağırlığı'} cssClass={'textCenter'} dataField={'mumAgirligi'} />
              <Column
                caption={'Oluşturma Tarihi'}
                cssClass={'textCenter'}
                dataField={'olusturmaTarihi'}
              />
              <Column
                caption={'Hazırlayan'}
                cssClass={'textCenter'}
                dataField={'hazirlayan'}
              />
              <Column caption={'Musteri Adet'} cssClass={'textCenter'} dataField={'musteriAdet'} />
              <Column caption={'Agac Tipi'} cssClass={'textCenter'} dataField={'agacTipi'} />

              <Column
                caption={'Firinlandi Mi?'}
                dataField={'firinlandiMi'}
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
              <Column caption={'Fırın numarası'} dataField={'firinId'} />

              <Column
                caption={'Aktif Mi?'}
                dataField={'aktif'}
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
                caption={'Gun Sonu?'}
                dataField={'gunSonuYapildiMi'}
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
                caption={'Acil Mi?'}
                dataField={'acilMi'}
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
            </DataGrid>
          </Fragment>
        ) : (
          <Alert apperance='danger'>Veri bulunamadı!</Alert>
        )}
      </div>
    </div>
  );
}

export default TreeHistory;
