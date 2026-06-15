import React from 'react';
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handleChangePage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };
  const pages = [];
  const maxButtons = 5;
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start + 1 < maxButtons) {
    start = Math.max(1, end - maxButtons + 1);
  }
  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <nav
      className="pagination"
      aria-label="Search result pages"
    >
      <button
        type="button"
        className="pagination-btn"
        onClick={() => handleChangePage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {start > 1 && (
        <>
          <button
            type="button"
            className="pagination-btn"
            onClick={() => handleChangePage(1)}
          >
            1
          </button>
          {start > 2 && <span className="pagination-ellipsis">…</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          className={`pagination-btn ${
            page === currentPage ? 'is-active' : ''
          }`}
          onClick={() => handleChangePage(page)}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="pagination-ellipsis">…</span>
          )}
          <button
            type="button"
            className="pagination-btn"
            onClick={() => handleChangePage(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className="pagination-btn"
        onClick={() => handleChangePage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
};

export default React.memo(Pagination);