import { SelectBox, TextBox } from 'devextreme-react';
import React from 'react';
import CheckBox from '../../components/Input/CheckBox';


function WallboardFilter({

  ayarFilter,
  setAyarFilter,
  renkFilter,
  setRenkFilter,
  durumFilter,
  setDurumFilter,
  acilMiFilter,
  setAcilMiFilter
}) {
  return (
    <div className='flex flex-row justify-end'>
      <TextBox
        valueChangeEvent={"keyup"}
        value={durumFilter}
        placeholder={'Aranacak durumu giriniz...'}
        onValueChanged={e => setDurumFilter(e.value)} />
      <TextBox
        valueChangeEvent={"keyup"}
        value={ayarFilter}
        placeholder={'Aranacak ayarı giriniz...'}
        onValueChanged={e => setAyarFilter(e.value)} />

      <TextBox
        valueChangeEvent={"keyup"}
        value={renkFilter}
        placeholder={'Aranacak renk giriniz...'}
        onValueChanged={e => setRenkFilter(e.value)} />
      <CheckBox
        valueChangeEvent={"onChange"}
        value={renkFilter}
        placeholder={'Acilleri Getir'}
        onValueChanged={e => setAcilMiFilter(e.value)}
      />
  

    </div>
  );
}

export default WallboardFilter;
