import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className='my-4'>
      <input
        type='text'
        className='w-full p-2 border border-gray-300 rounded-lg'
        placeholder='Search tasks...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;

