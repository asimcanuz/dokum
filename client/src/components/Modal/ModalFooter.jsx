import React from 'react';

function ModalFooter({ children }) {
  return (
    <div className='flex items-center justify-end p-6 border-t border-solid border-slate-200 bg-slate-50 dark:bg-slate-900 rounded-b space-x-4'>
      {children}
    </div>
  );
}

export default ModalFooter;
