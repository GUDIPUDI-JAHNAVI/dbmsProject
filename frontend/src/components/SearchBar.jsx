import React from 'react';

const SearchBar = ({ query, onQueryChange }) => {
  return (
    <div className="search-bar">
      <label htmlFor="search-input" className="field-label">
        Search
      </label>
      <div className="search-input-wrapper">
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by name or description..."
          className="search-input"
          aria-label="Search items by name or description"
        />
      </div>
    </div>
  );
};

export default React.memo(SearchBar);