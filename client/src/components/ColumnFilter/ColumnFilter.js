import React from 'react';
import Input from '../Input';

function ColumnFilter({ column }) {
  const { filterValue, setFilter } = column;
  return (
    <div className='flex items-center justify-end  '>
      <Input
        value={filterValue || ''}
        onChange={(e) => setFilter(e.target.value)}
        flexible={false}
      />
    </div>
  );
}

export default ColumnFilter;
