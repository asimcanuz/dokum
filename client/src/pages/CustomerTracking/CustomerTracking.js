import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import { statusColorStyle } from '../../utils/StatusColor';
import Alert from '../../components/Alert/Alert';
import Select from 'react-select';
import DataGrid, {
  Scrolling, Pager, Paging, FilterPanel,

  Column, FilterRow, HeaderFilter, ColumnChooser, Position, Export
} from 'devextreme-react/data-grid';

import { exportDataGrid } from 'devextreme/excel_exporter';

// import {jsPDF} from 'jspdf';
// import {exportDataGrid} from 'devextreme/pdf_exporter';
import { robotoFont } from "../../constants/robotoFont";
import { Workbook } from "exceljs";
import { saveAs } from 'file-saver'

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
            if (newArrItem[colorName][newArrItem[colorName].length - 1].tree.treeId === sortedObj[key][key2][key3].tree.treeId) {
              newArrItem[colorName][newArrItem[colorName].length - 1].quantity += sortedObj[key][key2][key3].quantity;
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
          }, signal: controller.signal,
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
      }, 2000);
    }

    return () => {
      isMounted = false;
      isMounted && controller.abort();
      clearInterval(interval);
    };
  }, [selectedJobGroup]);


  const getCellColor = (data) => {
    var statusArray = [];
    if (data !== undefined && data !== null) {
      console.log(data)
      data.forEach(tree => {
        statusArray.push(tree.tree.treeStatus.treeStatusName)
      })
    }
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
        value: jobGroup.id, label: 'No: ' + jobGroup.number + ' (' + jobGroup.date + ')',
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

  const applyFilterTypes = [{
    key: 'auto', name: 'Immediately',
  }, {
    key: 'onClick', name: 'On Button Click',
  }];

  const resizingModes = ['nextColumn', 'widget'];

  // const onPDFExporting = React.useCallback((e) => {
  //   const doc = new jsPDF();
  //   doc.addFileToVFS("Amiri-Regular.ttf", robotoFont);
  //   doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
  //   doc.setFont("Amiri");
  //
  //   exportDataGrid({
  //     jsPDFDocument: doc, component: e.component, indent: 5,
  //   }).then(() => {
  //     doc.save(`Müşteri-Takibi (${jobGroups.find(job => job.id === selectedJobGroup).number}).pdf`);
  //   });
  // });

  const onExcelExporting = useCallback((e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component, worksheet, autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
      });
    });
  })
  return (<div>
    <Header title={'Müşteri Takip'} description={'Müşterilerinin takibini gerçekleştir'} />
    <Select
      className='w-1/2'
      value={getJobGroupValue()}
      options={jobGroupOptions}
      onChange={(e) => {
        setSelectedJobGroup(e.value);
      }}
    />





    <div className='overflow-x-scroll' >
      {
        customersTracking?.length > 0 ? (
        <DataGrid
          height={700}
          id={'grid-container'}
          dataSource={customersTracking}
          showBorders={true}
          showRowLines={true}
          showColumnLines={true}
          allowColumnResizing={true}
          columnResizingMode={resizingModes[0]}
          onExporting={onExcelExporting}
          remoteOperations={true}
          wordWrapEnabled={true}

 

        >

          <FilterRow visible={true} />
          <FilterPanel visible={true} />


          <Scrolling rowRenderingMode='virtual'></Scrolling>
          <FilterRow visible={true}
            applyFilter={applyFilterTypes[0].key} />
          <HeaderFilter visible={true} />
          <Export enabled={true} allowExportSelectedData={true} />

          <Column width={70} caption={'M No.'} cssClass="text-center" dataField={'accountNumber'} />
          <Column width={200} caption={'Müşteri'} dataField={'customer'} />
          <Column width={70} caption={'Ayar'} dataField={'option'} />

            <Column  cssClass="myclass d-flex " allowExporting={false} caption={'Beyaz'} dataField={'Beyaz'} cellRender={({ data }) => {
            var k = 0;
            var colorClass = getCellColor(data.Beyaz);

            return <div className={`text-middle align-center d-flex w-full flex-col justify-between /*bg-[${colorClass}]*/  p-1 }`} style={{ display: 'flex', justifycontent:'center',   backgroundColor: `${colorClass}` }} >
              {data.Beyaz !== undefined ? data.Beyaz.map((item) => {
                k++;
                // son item değilse
                var borderClass = '';
                if (data.Beyaz.length > 1 && data.Beyaz.length !== k) {
                  borderClass = 'border-b  border-dashed border-spacing-2 border-black';
                }

                return (<div className={`d-flex flex-col justify-between ${borderClass} py-2 px-2 ${colorClass}`} style={{  display: 'flex', justifycontent: 'center', } }>
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${item.tree.treeStatus.treeStatusName}, Urun Miktarı = ${item.quantity}, Islem Tarihi = ${item.updatedAt}`}
                </div>);

              }) : null}
            </div>
          }}/>
          <Column  cssClass="myclass" bac allowExporting={false} dataField={'Kırmızı'} cellRender={({ data }) => {

            var k = 0;
            var colorClass = getCellColor(data.Kırmızı);

            return <div className={` d-flex w-full flex-col justify-between /*bg-[${colorClass}]*/  p-1 }`} style={{  backgroundColor: `${colorClass}` }} >
              {data.Kırmızı !== undefined ? data.Kırmızı.map((item) => {
                k++;
                // son item değilse
                var borderClass = '';
                if (data.Kırmızı.length > 1 && data.Kırmızı.length   !== k) {
                  borderClass = 'border-b  border-dashed border-spacing-2 border-black';
                }

                return (<div  className={`d-flex flex-col justify-between ${borderClass} py-2 px-2 ${colorClass}`}>
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${item.tree.treeStatus.treeStatusName}, Urun Miktarı = ${item.quantity}, Islem Tarihi = ${item.updatedAt}`}
                </div>);

              }) : null}
            </div>

          }} />
          <Column cssClass="myclass" allowExporting={false} dataField={'Yeşil'} cellRender={({ data }) => {
            var k = 0;
            var colorClass = getCellColor(data.Yeşil);

            return <div className={` d-flex w-full flex-col justify-between /*bg-[${colorClass}]*/  p-1 }`} style={{ backgroundColor: `${colorClass}` }} >
              {data.Yeşil !== undefined ? data.Yeşil.map((item, index) => {
                k++;
                // son item değilse
                var borderClass = '';


                if (data.Yeşil.length > 1 && data.Yeşil.length   !== k) {
                  borderClass = 'border-b  border-dashed border-spacing-2 border-black';
                }
                return (<div className={`d-flex flex-col justify-between ${borderClass} py-2 px-2 }`}>
                  {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${item.tree.treeStatus.treeStatusName}, Urun Miktarı = ${item.quantity}, Islem Tarihi = ${item.updatedAt}`}
                </div>);
              }) : null}
            </div>
          }} />

          <ColumnChooser
            enabled={true}
            mode={'aria-label'}
          >
            <Position
              my="right top"
              at="right top"
              of=".dx-datagrid-column-chooser-button"
            />

          </ColumnChooser>

        </DataGrid>) : (<div className="my-10"><Alert apperance={'danger'}>İş Grubu Seçiniz</Alert></div>)}
    </div>
  </div>);
}

export default CustomerTrackingPage;
