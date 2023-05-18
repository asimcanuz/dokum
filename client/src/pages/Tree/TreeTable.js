import React, { useState } from 'react';
import Alert from '../../components/Alert/Alert';
import Button from '../../components/Button';
import { BiLabel } from 'react-icons/bi';
import CreateLabel from './CreateLabel';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import CalculatedMineralWeight from '../../utils/calculateMineralWeight';
import calculateMineralWeight from '../../utils/calculateMineralWeight';
import { DataGrid } from 'devextreme-react';
import { Column, Editing, MasterDetail, Scrolling, Selection } from 'devextreme-react/data-grid';

function TreeTable({
  setClickTree,
  todayTrees,
  customers,
  descriptions,
  treeStatuses,
  creators,
  setUpdateClick,
  setTodayTrees,
  clickTreeId,
  jobGroups,
  selectedJobGroup,
  setSelectedJobGroup,
  treeTableRef,
  options,
  thicks,
  waxes,
  colors,
}) {
  const axiosPrivate = useAxiosPrivate();
  const [createLabel, setCreateLabel] = useState(false);

  const handleSaveMineralWeight = (data) => {
    let todayTree = data;
    let calculatedMineralWeight = Number(
      CalculatedMineralWeight(
        todayTree.waxWeight,
        todayTree.option.optionText,
        todayTree.color.colorName,
      ),
    );
    axiosPrivate.put(
      Endpoints.TREE.MAIN + '/mineralWeight',
      {
        treeId: data.treeId,
        waxWeight: Number(todayTree.waxWeight),
        mineralWeight: isNaN(calculatedMineralWeight) ? 0 : calculatedMineralWeight,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );
  };

  function selectionChanged(e) {
    e.component.collapseAll(-1);
    e.component.expandRow(e.currentSelectedRowKeys[0]);

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
      listeNo: clickedTree.listNo,
      siparisSayisi: clickedTree.orders.length,
      renk: clickedTree.color.colorName,
      ayar: clickedTree.option.optionText,
      kalinlik: clickedTree.thick.thickName,
      musteriSayisi: customerIds.length,
    });
  }

  function rowDblClick(e) {
    const { data } = e;
    const {
      active,
      colorId,
      creatorId,
      isImmediate,
      listNo,
      optionId,
      processId,
      thickId,
      treeNo,
      treeStatusId,
      waxId,
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
      listNo,
      optionId,
      processId,
      thickId,
      treeNo,
      treeStatusId,
      waxId,
    });
  }

  function onRowRemoving(e) {
    const { data } = e;
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

  return (
    <div className='space-y-4'>
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
          <BiLabel />
          <span>Etiket Oluştur</span>
        </Button>
      </div>
      {/*
      TODO: 
       * Form Editing: https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/FormEditing/React/Light/
       * PopUp Editing: https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/PopupEditing/React/Light/
      */}
      {todayTrees.length > 0 ? (
        <DataGrid
          id={'grid-container'}
          dataSource={todayTrees}
          showBorders={true}
          keyExpr={'treeId'}
          remoteOperations={true}
          height={700}
          hoverStateEnabled={true}
          onSelectionChanged={selectionChanged}
          onRowDblClick={rowDblClick}
          onRowRemoving={onRowRemoving}
          onRowUpdated={onRowUpdate}
        >
          <Editing
            mode={'cell'}
            useIcons={true}
            allowAdding={false}
            allowUpdating={true}
            allowDeleting={true}
          />
          <Scrolling mode='virtual' />
          <Selection mode={'single'} />
          <Column dataField={'treeNo'} caption={'Ağaç No'} width={'70px'} allowEditing={false} />
          <Column dataField={'listNo'} caption={'Liste No'} width={'70px'} allowEditing={false} />
          <Column
            dataField={'isImmediate'}
            caption={'Acil Mi'}
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
            allowEditing={false}
          />
          <Column
            caption={'Müşteri Adeti'}
            cellRender={({ data }) => {
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
            caption={'Ağaç Tipi'}
            cellRender={({ data }) => {
              if (Object.keys(data.orders).length > 0) {
                if (data.orders.length === 1) {
                  return data.orders[0].customer.customername;
                } else {
                  return 'karışık';
                }
              } else {
                return <div>-</div>;
              }
            }}
            allowEditing={false}
          />

          <Column caption={'Mum Türü'} dataField={'wax.waxName'} allowEditing={false} />
          <Column caption={'Ayar'} dataField={'option.optionText'} allowEditing={false} />
          <Column caption={'Kalınlık'} dataField={'thick.thickName'} allowEditing={false} />
          <Column caption={'Renk'} dataField={'color.colorName'} allowEditing={false} />
          <Column caption={'Tarih'} dataField={'date'} allowEditing={false} />
          <Column caption={'Durum'} dataField={'treeStatus.treeStatusName'} allowEditing={false} />
          <Column caption={'Hazırlayan'} dataField={'creator.creatorName'} allowEditing={false} />
          <Column
            caption={'Maden Ağırlık'}
            dataField={'mineralWeight'}
            allowEditing={false}
            cellRender={({ data }) => {
              return (
                <div>
                  {calculateMineralWeight(
                    data.waxWeight,
                    data.option.optionText,
                    data.color.colorName,
                  )}
                </div>
              );
            }}
          />
          <Column caption={'Mum Ağırlık'} dataField={'waxWeight'} />
          <MasterDetail
            render={(e) => {
              return treeMasterDetail(e.data, axiosPrivate, descriptions);
            }}
          />
        </DataGrid>
      ) : (
        <Alert apperance={'danger'}>Veri bulunamadı!</Alert>
      )}
      {createLabel ? (
        <CreateLabel
          open={createLabel}
          jobGroupId={selectedJobGroup}
          toggle={async () => {
            setCreateLabel(false);
          }}
        />
      ) : null}
    </div>
  );
}

function treeMasterDetail(data, axiosPrivate, descriptions) {
  let orders = data.orders;

  function onRowRemoving({ data }) {
    axiosPrivate.delete(
      Endpoints.ORDER,
      {
        data: { orderId: data.orderId },
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      },
    );
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
        <Scrolling mode='virtual' />
        <Column
          dataField={'customer.accountNumber'}
          caption={'Hesap Numarası'}
          allowEditing={false}
          width={70}
        />
        <Column dataField={'customer.customerName'} caption={'Müşteri Adı'} allowEditing={false} />
        <Column dataField={'quantity'} caption={'Adet'} allowEditing={false} />
        <Column
          dataField={'descriptionId'}
          caption={'Açıklama'}
          allowEditing={false}
          cellRender={({ data }) => {
            return descriptions?.find((desc) => desc.descriptionId === data.descriptionId)
              ?.descriptionText;
          }}
        />
      </DataGrid>
    </div>
  );
}

export default TreeTable;
