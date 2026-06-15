import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ResultList from '../components/ResultList';
import Pagination from '../components/Pagination';
import { apibaseurl, callApi, getToken, resolveImageUrl } from '../lib';

const readNumberParam = (params, key, defaultValue) => {
  const raw = params.get(key);
  if (!raw) return defaultValue;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRatingParam = searchParams.get('minRating') || '0';
  const currentPage = readNumberParam(searchParams, 'page', 1);
  const minRating = Number(minRatingParam) || 0;

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, String(value));
    });
    if (!('page' in updates)) next.delete('page');
    setSearchParams(next);
  };

  useEffect(() => {
    setIsLoading(true);
    setError('');

    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'all') params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating > 0) params.set('minRating', String(minRating));
    params.set('page', String(currentPage));
    params.set('pageSize', '12');

    callApi(
      'GET',
      `${apibaseurl}/itemservice/search?${params.toString()}`,
      null,
      (res) => {
        if (res.code !== 200) {
          setError(res.message || 'Failed to load items');
          setItems([]);
          setIsLoading(false);
          return;
        }

        const normalized = (res.data.items || []).map((item) => ({
          ...item,
          price: Number(item.price),
          rating: Number(item.rating),
          image: resolveImageUrl(item.image),
        }));

        setItems(normalized);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(res.data.totalPages || 1);
        setIsLoading(false);
      },
      getToken()
    );
  }, [query, category, minPrice, maxPrice, minRating, currentPage]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const currentSafePage = Math.min(Math.max(currentPage, 1), totalPages);

  return (
    <div className="search-page">
      <section className="controls-container">
        <SearchBar query={query} onQueryChange={(v) => updateParams({ q: v })} />
        <FilterPanel
          category={category}
          onCategoryChange={(v) => updateParams({ category: v === 'all' ? null : v })}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={(v) => updateParams({ minPrice: v || null })}
          onMaxPriceChange={(v) => updateParams({ maxPrice: v || null })}
          minRating={String(minRating)}
          onMinRatingChange={(v) => updateParams({ minRating: v || null })}
        />
        <div className="cart-summary">
          <h3>Cart ({cart.length})</h3>
          {cart.map((item) => (
            <p key={item.id}>{item.name} - ${item.price.toFixed(2)}</p>
          ))}
          <strong>Total: ${totalPrice.toFixed(2)}</strong>
        </div>
        <div className="wishlist-summary">
          <h3>Wishlist ({wishlist.length})</h3>
          {wishlist.map((item) => (
            <p key={item.id}>{item.name}</p>
          ))}
        </div>
      </section>
      <section className="results-container">
        {error && <p className="auth-error">{error}</p>}
        <ResultList
          items={items}
          isLoading={isLoading}
          totalCount={totalCount}
          onAddToCart={(item) =>
            setCart((prev) => (prev.find((i) => i.id === item.id) ? prev : [...prev, item]))
          }
          onAddToWishlist={(item) =>
            setWishlist((prev) => (prev.find((i) => i.id === item.id) ? prev : [...prev, item]))
          }
        />
        {!isLoading && totalCount > 0 && (
          <Pagination
            currentPage={currentSafePage}
            totalPages={totalPages}
            onPageChange={(page) => updateParams({ page })}
          />
        )}
      </section>
    </div>
  );
};

export default SearchPage;
