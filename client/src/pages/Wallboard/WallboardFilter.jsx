import {SelectBox, TextBox} from 'devextreme-react';
import React from 'react';

const fields = [
  {value: 'optionId', label: 'Ayar'},
  {value: 'colorId', label: 'Renk'},
];

function WallboardFilter({filter, setFilter}) {
  return (
    <div className='flex flex-row justify-end'>
      <TextBox
        valueChangeEvent={"keyup"}
        value={filter.filterText}
        placeholder={'Filtre kelimesi'}
        onValueChanged={e => setFilter({...filter, filterText: e.value})}/>
      <SelectBox
        className='rounded-none'
        items={fields}
        value={filter.filterField}
        valueExpr={'value'}
        displayExpr={'label'}
        placeholder={'Hangi alan filtrelenecek'}
        onValueChanged={e => {
          setFilter({...filter, filterField: e.value})
        }}
      />
    </div>
  );
}

export default WallboardFilter;
