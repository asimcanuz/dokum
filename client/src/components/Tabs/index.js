import React from 'react';

function Tabs({ tabsList, setSelected, selectedTab }) {
  return (
    <ul className='flex'>
      {tabsList.map((tab) => {
        return (
          <li
            key={tab.id}
            className={`px-6 py-4 transition ${
              selectedTab === tab.id ? 'border-b border-b-blue-700 dark:bg-slate-800' : null
            }`}
            onClick={() => {
              sessionStorage.setItem('selectedTab', tab.id);
              setSelected(tab.id);
            }}
          >
            {tab.name}
          </li>
        );
      })}
    </ul>
  );
}

export default Tabs;
