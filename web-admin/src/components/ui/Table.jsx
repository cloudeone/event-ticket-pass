import React from 'react';
import './Table.css';

export default function Table({
  columns = [], // Array<{ key: string, label: string, render?: (row) => React.ReactNode, width?: string, align?: 'left'|'center'|'right' }>
  data = [],
  keyExtractor = (row, idx) => row.id || idx,
  loading = false,
  emptyMessage = 'Tidak ada data untuk ditampilkan.',
  className = '',
}) {
  return (
    <div className={`table-container ${className}`}>
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width, textAlign: col.align || 'left' }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="table-loading-cell">
                <div className="table-loading-spinner" />
                <span>Memuat data...</span>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty-cell">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={keyExtractor(row, idx)}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
