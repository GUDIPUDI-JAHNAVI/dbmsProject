import React from 'react';
import ItemCard from './ItemCard';

const ResultList = ({
  items,
  isLoading,
  totalCount,
  onAddToCart,
  onAddToWishlist
}) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!items.length) {
    return <p>No items found</p>;
  }

  return (
    <div>
      <p>
        Showing {items.length} of {totalCount}
      </p>

      <div className="result-grid">
        {items.map((item, index) => (
  <ItemCard
    key={item.id}
    item={item}
    index={index}
    onAddToCart={onAddToCart}
    onAddToWishlist={onAddToWishlist}
  />
))}
      </div>
    </div>
  );
};

export default React.memo(ResultList);