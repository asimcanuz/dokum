import React from 'react';
import { DataGrid } from 'devextreme-react';
import { Column } from 'devextreme-react/data-grid';
import Alert from '../../components/Alert/Alert';

function OvenTable({ ovenList, erkenGrupDisabled, ovenNumber }) {
  return (
    <div className='px-2 py-4 space-y-2 flex flex-col items-center border border-slate-400 w-1/3'>
      {erkenGrupDisabled && ovenNumber === 1 && <h4 className='text-red-900'>Erken Fırın</h4>}
      <h4>UST</h4>
      {ovenList.ust.length > 0 ? (
        <Table list={ovenList.ust} konum={'ÜST'} />
      ) : (
        <Alert apperance={'warning'}>Fırın Boştur!</Alert>
      )}
      <h4>ALT</h4>
      {ovenList.alt.length > 0 ? (
        <Table list={ovenList.alt} konum={'ALT'} />
      ) : (
        <Alert apperance={'warning'}>Fırın Boştur!</Alert>
      )}
    </div>
  );
}

function Table({ list }) {
  return (
    <DataGrid
      dataSource={list}
      showBorders={true}
      rowAlternationEnabled={true}
      showRowLines={true}
      style={{ height: '620px' }}
    >
      <Column
        caption={'Sıra'}
        cellRender={(data) => {
          let rowIndex = data.rowIndex + 1;
          return rowIndex > 13 ? rowIndex + ' iç' : rowIndex;
        }}
      />
      <Column dataField={'treeNo'} caption={'Ağaç Numarası'} alignment={'center'} />
      <Column
        caption={'Yerleştiği Fırın'}
        alignment={'center'}
        cellRender={({ data }) => {
          return data.yerlestigiFirin + '-' + data.yerlestigiKonum;
        }}
      />
      <Column
        dataField={'treeNo'}
        caption={'Yerleşmesi Gereken Fırın'}
        alignment={'center'}
        cellRender={({ data }) => {
          return data.yerlesmesiGerekenFirin ||
            data.yerlesmesiGerekenFirin !== '' ||
            data.yerlesmesiGerekenFirin !== ' ' ||
            data.yerlesmesiGerekenFirin !== 'iç' ||
            data.yerlesmesiGerekenFirin.length > 0
            ? data.yerlesmesiGerekenFirin
            : '-';
        }}
      />
    </DataGrid>
  );
}

export default OvenTable;
