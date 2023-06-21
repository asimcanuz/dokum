import 'devextreme/dist/css/dx.light.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-tooltip/dist/react-tooltip.css';
import trMessages from 'devextreme/localization/messages/tr.json';
import { loadMessages, locale } from 'devextreme/localization';

import Routers from './Routes';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    sessionStorage.setItem('locale', 'tr');
    loadMessages(trMessages);
    locale('tr');
  }, []);

  return (
    <section className='app'>
      <Routers />
    </section>
  );
}

export default App;
