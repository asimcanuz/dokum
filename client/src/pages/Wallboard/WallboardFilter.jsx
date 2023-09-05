import {SelectBox, TextBox} from 'devextreme-react';
import React from 'react';


function WallboardFilter({

                           ayarFilter,
                           setAyarFilter,
                           renkFilter,
                           setRenkFilter,
                           durumFilter,
                           setDurumFilter
                         }) {
  return (
    <div className='flex flex-row justify-end'>
      <TextBox
        valueChangeEvent={"keyup"}
        value={durumFilter}
        placeholder={'Aranacak durumu giriniz...'}
        onValueChanged={e => setDurumFilter(e.value)}/>
      <TextBox
        valueChangeEvent={"keyup"}
        value={ayarFilter}
        placeholder={'Aranacak ayarı giriniz...'}
        onValueChanged={e => setAyarFilter(e.value)}/>

      <TextBox
        valueChangeEvent={"keyup"}
        value={renkFilter}
        placeholder={'Aranacak renk giriniz...'}
        onValueChanged={e => setRenkFilter(e.value)}/>

    </div>
  );
}

export default WallboardFilter;
