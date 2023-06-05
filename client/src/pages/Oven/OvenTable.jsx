import React from 'react';
import { DataGrid } from 'devextreme-react';
import { Column } from 'devextreme-react/data-grid';

function OvenTable({ ovenList, erkenGrupDisabled, ovenNumber }) {
  return (
    <div className='px-2 py-4 space-y-2 flex flex-col items-center border border-slate-400 w-1/3'>
      {erkenGrupDisabled && ovenNumber === 1 && <h4 className='text-red-900'>Erken Fırın</h4>}
      <Table list={ovenList.ust} konum={'ÜST'} />
      <Table list={ovenList.alt} konum={'ALT'} />
    </div>
  );
}

function Table({ list }) {
  return (
    <DataGrid dataSource={list} showBorders={true} rowAlternationEnabled={true} showRowLines={true}>
      <Column dataField={'treeNo'} caption={'Ağaç Numarası'} alignment={'center'} />
      <Column
        caption={'Ağaç Numarası'}
        alignment={'center'}
        cellRender={({ data }) => {
          return data.yerlestigiFirin + '-' + data.yerlestigiKonum;
        }}
      />
      <Column
        dataField={'treeNo'}
        caption={'Ağaç Numarası'}
        alignment={'center'}
        cellRender={({ data }) => {
          return data.yerlesmesiGerekenFirin || data.yerlesmesiGerekenFirin !== ''
            ? data.yerlesmesiGerekenFirin
            : '-';
        }}
      />
    </DataGrid>
  );
}

export default OvenTable;
