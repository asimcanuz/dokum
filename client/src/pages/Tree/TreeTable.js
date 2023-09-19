 import React, {useState} from 'react';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button';
import {BiLabel} from 'react-icons/bi';
import CreateLabel from './CreateLabel';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Endpoints} from '../../constants/Endpoints';
import CalculatedMineralWeight from '../../utils/calculateMineralWeight';
import calculateMineralWeight from '../../utils/calculateMineralWeight';
import { DataGrid, SelectBox, Lookup  } from 'devextreme-react';
import { Row, Column, Editing, Paging,  Export, FilterRow, HeaderFilter, MasterDetail, Scrolling, Selection,Item} from 'devextreme-react/data-grid';
import {Workbook} from 'exceljs';
import {exportDataGrid} from 'devextreme/excel_exporter';
import {saveAs} from 'file-saver';
import {statusColorStyle} from '../../utils/StatusColor';
import {axiosPrivate} from '../../api/axios';
import {Link} from "react-router-dom";
import CreateLabelNew from "./CreateLabelNew";




function onFocusedRowChanged(e) {

  console.log("row cchanged"+ e.row)

};

function onRowInserted(e) {
  console.log("row added");

};

function onRowClick(e) {


  e.component.collapseAll(-1);

  if (e.isExpanded) {
    e.component.collapseRow(e.component.option('focusedRowKey'));

    console.log(e.isExpanded);

  } else
  {
    e.component.expandRow(e.key);
  }

};





function TreeTable(
  {
    setClickTree,
    todayTrees,
    descriptions,
    setUpdateClick,
    setTodayTrees,
    jobGroups,
    selectedJobGroup,
    treeStatuses,
  }) {
  const axiosPrivate = useAxiosPrivate();
  const [createLabel, setCreateLabel] = useState(false);

  const handleSaveMineralWeight = (data) => {
    let todayTree = data;
    let calculatedMineralWeight = Number(CalculatedMineralWeight(todayTree.waxWeight, todayTree.option.optionText, todayTree.color.colorName));
    axiosPrivate.put(Endpoints.TREE.MAIN + '/mineralWeight', {
      treeId: data.treeId,
      waxWeight: Number(todayTree.waxWeight),
      mineralWeight: isNaN(calculatedMineralWeight) ? 0 : calculatedMineralWeight,
    }, {
      headers: {'Content-Type': 'application/json'}, withCredentials: true,
    },);
  };

  function selectionChanged(e) {


   // e.component.collapseAll(-1);
   // e.component.expandRow(e.currentSelectedRowKeys[0]);
    
    
    let clickedTree = e.selectedRowsData[0];
    let customerIds = [];

    clickedTree.orders.forEach((order) => {
      if (!customerIds.includes(order.customerId)) {
        customerIds.push(order.customerId);
      }
    });
    setClickTree({
      agacId: clickedTree.treeId,
      agacNo: clickedTree.treeNo,
    //  listeNo: clickedTree.listNo,
      siparisSayisi: clickedTree.orders.length,
      renk: clickedTree.color.colorName,
      ayar: clickedTree.option.optionText,
      kalinlik: clickedTree.thick.thickName,
      musteriSayisi: customerIds.length,
    });
  }

  function rowDblClick(e) {
    const { data } = e;
    // if (data.treeStatus.treeStatusName !== 'Hazırlanıyor') return;
    const {
      active,
      colorId,
      creatorId,
      isImmediate,
    //  listNo,
      optionId,
      processId,
      thickId,
      treeNo,
      treeStatusId,
     // waxId,
      treeId,
      desc,
    } = data;
    setUpdateClick({
      open: true,
      treeId,
      active,
      colorId,
      creatorId,
      desc,
      isImmediate,
    //  listNo,
      optionId,
      processId,
      thickId,
      treeNo,
      treeStatusId,
     // waxId,
    });
  }

  function onRowRemoving(e) {
    const {data} = e;
    let deletedtree = axiosPrivate.put(Endpoints.TREE.PASSIVE, {
      treeId: data.treeId,
    });

    deletedtree.then((res) => {
      let newtodaytrees = todayTrees.filter((todaytree) => todaytree.treeId !== data.treeId);
      setTodayTrees(newtodaytrees);
    });
  }

  function onRowUpdate(e) {
    handleSaveMineralWeight(e.data);
  }



  function onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component, worksheet, autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], {type: 'application/octet-stream'}), selectedJobGroup + '-IsGrubuAgacListesi.xlsx',);
      });
    });
    e.cancel = true;
  }


  return (<div className='space-y-4'>
    <div className='flex flex-row justify-between items-center'>
      <div className='w-1/2 flex flex-row items-center space-x-11'>
        <h4 className={'text-lg font-medium '}>
          İş Grup:&nbsp;
          {jobGroups.find((j) => j.id === selectedJobGroup)?.number}
        </h4>
      </div>
      <Button
        appearance={'success'}
        onClick={() => {
          try {
            if (selectedJobGroup === null || selectedJobGroup === '') {
              throw new Error('İş grubu seçiniz!');
            } else {
              setCreateLabel(true);
            }
          } catch (e) {
            alert(e.message);
          }
        }}
      >
        <BiLabel/>
        <span>Etiket Oluştur</span>
      </Button>
    </div>

    {todayTrees.length > 0 ? (<DataGrid

      focusedRowEnabled={true}
      id={'grid-container'}
      dataSource={todayTrees}
      showBorders={true}
      keyExpr={'treeId'}
      remoteOperations={true}
      height={700}
      hoverStateEnabled={true}
      onSelectionChanged={selectionChanged}
      onRowRemoving={onRowRemoving}
      onRowUpdated={onRowUpdate}
      onExporting={onExporting}
      onRowDblClick={rowDblClick}
      onRowClick={onRowClick}
      autoNavigateToFocusedRow={true}
      onRowInserted={onRowInserted}

      onFocusedRowChanged={onFocusedRowChanged}
      
   

      

      onRowPrepared={function (e) {
        if (e.rowType === 'data') {
          const bgColor = statusColorStyle(e.data.treeStatus.treeStatusName);
          e.rowElement.style.backgroundColor = bgColor;
        }
      }}
    >
      <Export enabled={true}/>
      <Editing
        mode={'cell'}
        useIcons={true}
        allowAdding={false}
        allowUpdating={true}
        allowDeleting={true}
      />

      <Scrolling mode='virtual'/>
      <Selection mode={ "single"} />
      
      
      <FilterRow visible={true}
                 applyFilter={'auto'} />
      <HeaderFilter visible={true} />
      <Column


        dataField={'treeNo'}
        caption={'Ağaç No'}
        width={'70px'}
        allowEditing={false}
        dataType={'integer'}
        defaultSortOrder={'asc'}
        // cellRender={({ value }) => parseInt(value)}
      />
      {/*<Column dataField={'listNo'} caption={'Liste No'} width={'70px'} allowEditing={false}/>*/}
      <Column
        dataField={'isImmediate'}
        caption={'Acil Mi'}
        cellRender={({value}) => value ? (
          <div className='bg-red-100 rounded-lg text-base text-red-700' role='alert'>
            Evet
          </div>) : (<div className='bg-blue-100 rounded-lg text-base text-blue-700' role='alert'>
          Hayır
        </div>)}
        allowEditing={false}
      />
      <Column
        dataField={'customerQuantity'}
        caption={'Müşteri Adeti'}
        cellRender={({data}) => {
          if (Object.keys(data.orders).length > 0) {
            let customerids = [];
            data.orders.forEach((order) => {
              if (!customerids.includes(order.customerId)) {
                customerids.push(order.customerId);
              }
            });
            return customerids.length;
          } else {
            return <div>0</div>;
          }
        }}
        allowEditing={false}
      />
      <Column
        dataField={'treeType'}
        caption={'Ağaç Tipi'}
        cellRender={({data}) => {
          if (Object.keys(data.orders).length > 0) {
            let name = data.orders[0].customer.customerName;
            let shuffle = false;

            data.orders.forEach((order) => {
              if (order.customer.customerName !== name) {
                shuffle = true;
              }
            });
            if (shuffle) {
              return 'Karışık';
            } else {
              return name;
            }
          } else {
            return <div>-</div>;
          }
        }}
        allowEditing={false}
      />
{/*      <Column caption={'Mum Türü'} dataField={'wax.waxName'} allowEditing={false}/>*/}
      <Column caption={'Ayar'} dataField={'option.optionText'} allowEditing={false}/>
      <Column caption={'Kalınlık'} dataField={'thick.thickName'} allowEditing={false}/>
      <Column caption={'Renk'} dataField={'color.colorName'} allowEditing={false}/>
      <Column caption={'Tarih'} dataField={'date'} allowEditing={false}/>
      <Column
        caption={'Durum'}
        dataField={'treeStatus.treeStatusName'}
        allowEditing={true}
        width={140}
        editCellComponent={(props) => (<StatusUpdateDropdown
          {...props}
          treeStatuses={treeStatuses}
          setTodayTrees={setTodayTrees}
          todayTrees={todayTrees}
        />)}
      >
        <Lookup
          dataSource={treeStatuses}
          valueExpr={'treeStatusId'}
          displayExpr={'treeStatusName'}
        />
      </Column>
      <Column caption={'Hazırlayan'} dataField={'creator.creatorName'} allowEditing={false}/>
      <Column
        caption={'Maden Ağırlık'}
        dataField={'mineralWeight'}
        allowEditing={false}
        cellRender={({data}) => {
          return (<div>
            {calculateMineralWeight(data.waxWeight, data.option.optionText, data.color.colorName,)}
          </div>);
        }}
      />
      <Column caption={'Mum Ağırlık'} dataField={'waxWeight'}/>


      <MasterDetail
        render={(e) => {
          return treeMasterDetail(e.data, axiosPrivate, descriptions, selectedJobGroup, setTodayTrees,);
        }}
      />
    </DataGrid>) : (<Alert apperance={'danger'}>Veri bulunamadı!</Alert>)}
    {createLabel ? (<CreateLabelNew
      open={createLabel}
      jobGroupId={selectedJobGroup}
      toggle={async () => {
        setCreateLabel(false);
      }}
    />) : null}
  </div>);
}

function treeMasterDetail(data, axiosPrivate, descriptions, selectedJobGroup, setTodayTrees) {
  let orders = data.orders;

  async function onRowRemoving({data}) {
    await axiosPrivate.delete(Endpoints.ORDER, {
      data: {orderId: data.orderId},
    }, {
      headers: {'Content-Type': 'application/json'}, withCredentials: true,
    },);
    let treeRes = await axiosPrivate.get(Endpoints.TREE.TODAY, {
      params: {
        jobGroupId: selectedJobGroup,
      },
    });
    setTodayTrees(treeRes.data.trees);
  }

  return (
    <div className={'flex flex-col space-y-4'}>
    <DataGrid
      dataSource={orders}
      id={'grid-container'}
      showBorders={true}
      keyExpr={'orderId'}
      remoteOperations={true}
      height={300}
      hoverStateEnabled={true}
      onRowRemoving={onRowRemoving}
    >
      <Editing
        mode={'cell'}
        useIcons={true}
        allowAdding={false}
        allowUpdating={false}
        allowDeleting={true}
      />
      <Scrolling mode='virtual'/>
      <Column
        dataField={'customer.accountNumber'}
        caption={'Hesap Numarası'}
        allowEditing={false}
        width={70}
      />
      <Column dataField={'customer.customerName'} caption={'Müşteri Adı'} allowEditing={false}/>
      <Column dataField={'quantity'} caption={'Adet'} allowEditing={false}/>
      <Column
        dataField={'isImmediate'}
        caption={'Acil Mi'}
        cellRender={({value}) => value ? (<div className='bg-red-100 rounded-lg text-base text-red-700' role='alert'>
          Evet
        </div>) : (<div className='bg-blue-100 rounded-lg text-base text-blue-700' role='alert'>
          Hayır
        </div>)}
        allowEditing={false}
      />
      <Column
        dataField={'descriptionId'}
        caption={'Açıklama'}
        allowEditing={false}
        cellRender={({data}) => {
          return descriptions?.find((desc) => desc.descriptionId === data.descriptionId)?.descriptionText;
        }}
      />
    </DataGrid>
  </div>);
}

function StatusUpdateDropdown({data, setTodayTrees, treeStatuses, todayTrees}) {
  const {data: rowData} = data;

  return (<SelectBox
    items={treeStatuses}
    valueExpr={'treeStatusId'}
    displayExpr={'treeStatusName'}
    defaultValue={rowData.treeStatus.treeStatusId}
    onValueChanged={async (e) => {
      let newStatusId = e.value;
      let status = treeStatuses.find((status) => status.treeStatusId === e.value);
      let trees = todayTrees.map((tree) => {
        if (tree.treeId === rowData.treeId) {
          tree.treeStatus.treeStatusId = newStatusId;
          tree.treeStatusId = newStatusId;
          tree.treeStatus.treeStatusName = status.treeStatusName;
        }
        return tree;
      });
      await axiosPrivate.post(Endpoints.TREE.UPDATREESTATUS, {
        treeStatusId: newStatusId, treeId: rowData.treeId,
      });

      setTodayTrees(trees);
    }}
  />);
}

export default TreeTable;
