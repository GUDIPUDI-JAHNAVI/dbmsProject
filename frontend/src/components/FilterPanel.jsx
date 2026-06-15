import React from 'react';

const FilterPanel = ({
  category,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minRating,
  onMinRatingChange
}) => {
  return (
    <section
      className="filter-panel"
      aria-label="Search filters"
    >
      <div className="filter-group">
        <label htmlFor="category-select" className="field-label">
          Category
        </label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="select-input"
        >
          <option value="all">All categories</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>

      <fieldset className="filter-group">
        <legend className="field-label">Price range</legend>
        <div className="price-range">
          <div className="price-field">
            <label htmlFor="min-price" className="visually-hidden">
              Minimum price
            </label>
            <input
              id="min-price"
              type="number"
              min="0"
              step="1"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="number-input"
              placeholder="Min"
              aria-label="Minimum price"
            />
          </div>
          <span className="price-separator">–</span>
          <div className="price-field">
            <label htmlFor="max-price" className="visually-hidden">
              Maximum price
            </label>
            <input
              id="max-price"
              type="number"
              min="0"
              step="1"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="number-input"
              placeholder="Max"
              aria-label="Maximum price"
            />
          </div>
        </div>
      </fieldset>

      <div className="filter-group">
        <label htmlFor="min-rating" className="field-label">
          Minimum rating
        </label>
        <select
          id="min-rating"
          value={minRating}
          onChange={(e) => onMinRatingChange(e.target.value)}
          className="select-input"
        >
          <option value="0">Any rating</option>
          <option value="3">3★ and up</option>
          <option value="3.5">3.5★ and up</option>
          <option value="4">4★ and up</option>
          <option value="4.5">4.5★ and up</option>
        </select>
      </div>
    </section>
  );
};

export default React.memo(FilterPanel);