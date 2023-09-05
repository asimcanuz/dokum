import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import { statusColorStyle } from '../../utils/StatusColor';
import Alert from '../../components/Alert/Alert';
import Select from 'react-select';
import DataGrid, {
  Column,
  FilterRow,
  HeaderFilter,
  Search,
  SearchPanel,
  ColumnChooser,
  Position,
  Export
} from 'devextreme-react/data-grid';
import { jsPDF } from 'jspdf';
import { exportDataGrid } from 'devextreme/pdf_exporter';
import {robotoFont} from "../../constants/robotoFont";

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
  
  const applyFilterTypes = [{
    key: 'auto',
    name: 'Immediately',
  }, {
    key: 'onClick',
    name: 'On Button Click',
  }];

  const resizingModes = ['nextColumn', 'widget'];
  
  const onPDFExporting = React.useCallback((e) => {
    const doc = new jsPDF();
    doc.addFileToVFS("Amiri-Regular.ttf", robotoFont);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");

    exportDataGrid({
      jsPDFDocument: doc,
      component: e.component,
      indent: 5,
    }).then(() => {
      doc.save(`Müşteri-Takibi (${jobGroups.find(job=>job.id===selectedJobGroup).number}).pdf`);
    });
  });

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
         <DataGrid
         id={'grid-container'}
         dataSource={customersTracking}
         showBorders={true}
         showRowLines={true}
         showColumnLines={true}
         allowColumnResizing={true}

         columnResizingMode={resizingModes[0]}
         columnMinWidth={50}
         columnAutoWidth={true}
         columnHidingEnabled={true}
         onExporting={onPDFExporting}>

         >
           
           <FilterRow visible={true}
                      applyFilter={applyFilterTypes[0].key} />
           <HeaderFilter visible={true} />
           <Export enabled={true} formats={['pdf']} />

           <Column width={'70px'} caption={'Müşteri No.'} dataField={'accountNumber'}/>
        <Column width={'200px'} caption={'Müşteri'} dataField={'customer'}/>
        <Column width={'70px'} caption={'Ayar'} dataField={'option'} />
        <Column caption={'Beyaz'}  allowExporting={false} dataField={'Beyaz'} cellRender={({data})=>{
          return data.Beyaz !== undefined ? data.Beyaz.map((item) => {
            // son item değilse
            var borderClass = '';
            if ( data.Beyaz.length >1) {
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
          }) : null;
        }}/>
        <Column dataField={'Kırmızı'} allowExporting={false} cellRender={({data})=>{
          return data.Kırmızı !== undefined ? data.Kırmızı.map((item) => {
            // son item değilse
            var borderClass = '';
            if ( data.Kırmızı.length >1) {
              borderClass = 'border-b  border-dashed border-spacing-2 border-black';
            }
            return (
              <div className={`d-flex flex-col justify-between ${borderClass} py-2 px-2 }`}>
                {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${
                  item.tree.treeStatus.treeStatusName
                }, Urun Miktarı = ${item.quantity}, Islem Tarihi = ${item.updatedAt.slice(
                  0,
                  10,
                )}`}
              </div>
            );
          }) : null;
        }}/>
        <Column dataField={'Yeşil'} allowExporting={false} cellRender={({data})=>{
          return data.Yeşil !== undefined ? data.Yeşil.map((item) => {
            // son item değilse
            var borderClass = '';
            if ( data.Yeşil.length >1) {
              borderClass = 'border-b  border-dashed border-spacing-2 border-black';
            }
            return (
              <div className={`d-flex flex-col justify-between ${borderClass} py-2 px-2 }`}>
                {` Agaç = ${item.tree.treeNo}, İşlem Adımı= ${
                  item.tree.treeStatus.treeStatusName
                }, Urun Miktarı = ${item.quantity}, Islem Tarihi = ${item.updatedAt.slice(
                  0,
                  10,
                )}`}
              </div>
            );
          }) : null;
        }}/>

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

         </DataGrid>
        ) : (
          <Alert apperance={'danger'}>Aktif Ağaç bulunamadı</Alert>
        )}
      </div>
    </div>
  );
}

export default CustomerTrackingPage;
