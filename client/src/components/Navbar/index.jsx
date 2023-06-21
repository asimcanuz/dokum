import React from 'react';
import ThemeSwitcher from '../ThemeSwitcher';
import useAuth from '../../hooks/useAuth';

function Navbar() {
  const { auth } = useAuth();
  return (
    <div className='bg-transparent flex flex-row items-center pt-6 px-6 justify-end  space-x-4 '>
      <ThemeSwitcher />
      <div className='text-lg font-bold'>{auth.username}</div>
    </div>
  );
}

export default Navbar;
