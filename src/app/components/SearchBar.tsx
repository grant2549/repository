import React from 'react';

interface SearchBarProps {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({ searchInput, setSearchInput }: SearchBarProps) => {
  return (
    <div className="mb-4">
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="search-input"
        type="text"
        placeholder="Search by character name..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
