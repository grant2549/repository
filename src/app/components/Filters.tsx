import React from 'react';

interface FiltersProps {
  handleSortByDate: () => void;
}

const Filters = ({ handleSortByDate }: FiltersProps) => {
  return (
    <div className="mb-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleSortByDate}
      >
        Sort by date created
      </button>
    </div>
  );
};

export default Filters;
