import React, { useState } from 'react';
import Header from '../../components/Header';

import ListMenu from '../../components/ListMenu';
import MumTuru from './MumTuru';
import Ayar from './Ayar';
import Hazirlayanlar from './Hazirlayanlar';
import Aciklamalar from './Aciklamalar';
import Kalinlik from './Kalinlik';
import Renkler from './Renkler';
import ProcessTimes from './ProcessTimes';

const menuList = [
  {
    name: 'Mum Türü',
    key: 'mumTuru',
  },
  {
    name: 'Ayar',
    key: 'ayar',
  },
  {
    name: 'Kalınlık',
    key: 'kalinlik',
  },
  {
    name: 'Renkler',
    key: 'renkler',
  },
  {
    name: 'Açıklamalar',
    key: 'aciklamalar',
  },
  {
    name: 'Hazırlayan',
    key: 'hazirlayan',
  },
  {
    name: 'İşlem Zamanı',
    key: 'islemZamani',
  },
];

// TODO : icon renkleri düzenle
function ConfigurationsPage() {
  const [selected, setSelected] = useState('mumTuru');

  return (
    <div className='space-y-4 '>
      <Header
        title={'Konfigürasyonlar'}
        description={'Uygulamanın bazı konfigürasyon ayarlarını buradan yapabilirsiniz.'}
      />

      <ListMenu selected={selected} setSelected={setSelected} menuList={menuList} />

      <SelectedConfigurator selected={selected} />
    </div>
  );
}

function SelectedConfigurator({ selected }) {
  switch (selected) {
    case 'mumTuru':
      return <MumTuru />;
    case 'ayar':
      return <Ayar />;
    case 'hazirlayan':
      return <Hazirlayanlar />;
    case 'aciklamalar':
      return <Aciklamalar />;
    case 'kalinlik':
      return <Kalinlik />;
    case 'renkler':
      return <Renkler />;
    case 'islemZamani':
      return <ProcessTimes />;
    default:
      return;
  }
}

export default ConfigurationsPage;
