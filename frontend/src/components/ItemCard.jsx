import React from 'react';

import book1 from '../assets/book1.jpeg';
import book2 from '../assets/book2.jpeg';
import book3 from '../assets/book3.jpeg';
import book4 from '../assets/book4.jpg';
import book5 from '../assets/book5.jpg';
import book6 from '../assets/book6.jpg';
import book7 from '../assets/book7.jpeg';
import book8 from '../assets/book8.jpg';
import book9 from '../assets/book9.jpg';
import book10 from '../assets/book10.png';

import clothing1 from '../assets/clothing1.jpg';
import clothing2 from '../assets/clothing2.webp';
import clothing3 from '../assets/clothing3.webp';
import clothing4 from '../assets/clothing4.webp';
import clothing5 from '../assets/clothing5.webp';
import clothing6 from '../assets/clothing6.webp';
import clothing7 from '../assets/clothing7.webp';
import clothing8 from '../assets/clothing8.webp';
import clothing9 from '../assets/clothing9.webp';
import clothing10 from '../assets/clothing10.webp';
import clothing11 from '../assets/clothing11.webp';
import clothing12 from '../assets/clothing12.webp';


import electronics1 from '../assets/electronics1.webp';
import electronics2 from '../assets/electronics2.webp';
import electronics3 from '../assets/electronics3.webp';
import electronics4 from '../assets/electronics4.webp';
import electronics5 from '../assets/electronics5.webp';
import electronics6 from '../assets/electronics6.webp';

const allImages = {
  Books: [
    book1,
    book2,
    book3,
    book4,
    book5,
    book6,
    book7,
    book8,
    book9,
    book10
  ],

  Clothing: [
    clothing1,
    clothing2,
    clothing3,
    clothing4,
    clothing5,
    clothing6,
    clothing7,
    clothing8,
    clothing9,
    clothing10,
    clothing11,
    clothing12
  ],

  Electronics: [
    electronics1,
    electronics2,
    electronics3,
    electronics4,
    electronics5,
    electronics6
  ]
};

const ItemCard = ({
  item,
  index,
  onAddToCart,
  onAddToWishlist
}) => {

  // AUTO IMAGE SELECTION
  const categoryImages = allImages[item.category] || [];
  const image =
    categoryImages[index % categoryImages.length];

  return (
    <>
      {/* INTERNAL CSS */}
      <style>
        {`
          .item-card {
            background: #020101;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 14px rgba(0,0,0,0.1);
            transition: 0.3s ease;
            display: flex;
            flex-direction: column;
          }

          .item-card:hover {
            transform: translateY(-5px);
          }

          .item-image-wrapper {
            width: 100%;
            height: 240px;
            overflow: hidden;
            background: #020101;
          }

          .item-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .item-content {
            padding: 16px;
          }

          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .item-name {
            font-size: 18px;
            font-weight: bold;
            margin: 0;
          }

          .item-category {
            background: #08010a;
            padding: 4px 10px;
            border-radius: 10px;
            font-size: 12px;
          }

          .item-description {
            color: #555;
            font-size: 14px;
            margin-bottom: 14px;
          }

          .item-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
          }

          .item-price {
            font-size: 18px;
            font-weight: bold;
            color: #1a8917;
          }

          .item-rating {
            font-size: 15px;
          }

          .item-actions {
            display: flex;
            gap: 10px;
          }

          .item-actions button {
            flex: 1;
            padding: 10px;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            transition: 0.2s;
          }

          .item-actions button:first-child {
            background: #007bff;
            color: white;
          }

          .item-actions button:last-child {
            background: #ff4081;
            color: white;
          }

          .item-actions button:hover {
            opacity: 0.9;
          }
        `}
      </style>

      <article className="item-card">

        {/* IMAGE */}
        <div className="item-image-wrapper">
          <img
            src={image}
            alt={item.name}
            className="item-image"
          />
        </div>

        {/* CONTENT */}
        <div className="item-content">

          <header className="item-header">
            <h3 className="item-name">
              {item.name}
            </h3>

            <span className="item-category">
              {item.category}
            </span>
          </header>

          <p className="item-description">
            {item.description}
          </p>

          <div className="item-meta">
            <span className="item-price">
              ${item.price.toFixed(2)}
            </span>

            <span className="item-rating">
              ⭐ {item.rating.toFixed(1)}
            </span>
          </div>

          {/* BUTTONS */}
          <div className="item-actions">

            <button
              onClick={() => onAddToCart(item)}
            >
              Add to Cart
            </button>

            <button
              onClick={() => onAddToWishlist(item)}
            >
              Wishlist
            </button>

          </div>
        </div>
      </article>
    </>
  );
};

export default React.memo(ItemCard);