import React from 'react';
import { useThemeContext } from '../../context/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';
function ThemeSwitcher() {
  const { handleThemeSwitch, theme } = useThemeContext();

  return (
    <div className='z-50 cursor-pointer' onClick={() => handleThemeSwitch()}>
      {theme === 'dark' ? (
        <FaSun size={'24px'} color='#FFE87C' />
      ) : (
        <FaMoon size={'24px'} color='#9ca3af' />
      )}
    </div>
  );
}

export default ThemeSwitcher;
