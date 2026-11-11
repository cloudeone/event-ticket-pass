import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className = '',
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className={`pagination ${className}`}>
      <div className="pagination__info">
        Menampilkan <strong className="tabular-nums">{startItem} - {endItem}</strong> dari{' '}
        <strong className="tabular-nums">{totalItems}</strong> Data
      </div>

      <div className="pagination__controls">
        {onPageSizeChange && (
          <div className="pagination__size">
            <span className="pagination__size-label">Per Halaman:</span>
            <select
              className="pagination__select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pagination__pages">
          <button
            className="pagination__btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange && onPageChange(currentPage - 1)}
            aria-label="Halaman Sebelumnya"
          >
            <ChevronLeft size={16} />
            <span className="pagination__btn-text">Sebelumnya</span>
          </button>

          {pages.map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} className="pagination__dots">
                ...
              </span>
            ) : (
              <button
                key={p}
                className={`pagination__page-btn ${
                  currentPage === p ? 'pagination__page-btn--active' : ''
                }`}
                onClick={() => onPageChange && onPageChange(p)}
              >
                {p}
              </button>
            )
          )}

          <button
            className="pagination__btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange && onPageChange(currentPage + 1)}
            aria-label="Halaman Selanjutnya"
          >
            <span className="pagination__btn-text">Selanjutnya</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

