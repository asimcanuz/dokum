import React from 'react';
import PropTypes from 'prop-types';
function ListMenu({ selected, setSelected, menuList }) {
  return (
    <div className='flex flex-row flex-wrap border-t border-b border-gray-50 text-lg'>
      {menuList.map((menu) => {
        return (
          <div
            key={menu.key}
            className={` p-2 ${
              selected === menu.key ? 'font-medium text-blue-600' : 'font-normal'
            } cursor-pointer transition-colors`}
            onClick={() => {
              setSelected(menu.key);
            }}
          >
            {menu.name}
          </div>
        );
      })}
    </div>
  );
}

ListMenu.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
  menuList: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};
export default ListMenu;
