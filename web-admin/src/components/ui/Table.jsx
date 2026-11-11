import React from 'react';
import './Table.css';

export function Table({
  columns,
  data,
  keyExtractor = (item, idx) => item.id || idx,
  emptyMessage = 'Tidak ada data.',
  onRowClick,
  children,
  className = '',
  ...props
}) {
  if (children) {
    return (
      <div className={`table-container ${className}`}>
        <table className="table" {...props}>
          {children}
        </table>
      </div>
    );
  }

  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div className={`table-container ${className}`}>
      <table className="table" {...props}>
        <thead className="table__head">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key || col.label}
                className={`table__th table__th--${col.align || 'left'}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table__body">
          {!hasData ? (
            <tr>
              <td colSpan={columns.length} className="table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => {
              const rowKey = keyExtractor(row, idx);
              return (
                <tr
                  key={rowKey}
                  className={`table__row ${onRowClick ? 'table__row--clickable' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key || col.label}
                      className={`table__td table__td--${col.align || 'left'}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return <thead className={`table__head ${className}`}>{children}</thead>;
}

export function TableBody({ children, className = '' }) {
  return <tbody className={`table__body ${className}`}>{children}</tbody>;
}

export function TableRow({ children, className = '', clickable = false, onClick, ...props }) {
  return (
    <tr
      className={`table__row ${clickable ? 'table__row--clickable' : ''} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '', align = 'left', ...props }) {
  return (
    <th className={`table__th table__th--${align} ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', align = 'left', ...props }) {
  return (
    <td className={`table__td table__td--${align} ${className}`} {...props}>
      {children}
    </td>
  );
}

export default Table;
