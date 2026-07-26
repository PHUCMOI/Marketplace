import React, { HTMLAttributes } from 'react';
import './Table.css';

export interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> extends HTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  rowKey?: string | ((record: T) => string);
  onRowClick?: (record: T, index: number) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyText = 'No data available',
  striped = false,
  hoverable = true,
  bordered = true,
  rowKey = 'id',
  onRowClick,
  className = '',
  ...props
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  };

  const classes = [
    'table',
    striped ? 'table-striped' : '',
    hoverable ? 'table-hoverable' : '',
    bordered ? 'table-bordered' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  if (loading) {
    return (
      <div className="table-loading">
        <div className="table-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className={classes} {...props}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width, textAlign: column.align || 'left' }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                onClick={() => onRowClick?.(record, index)}
                className={onRowClick ? 'table-row-clickable' : ''}
              >
                {columns.map((column) => (
                  <td key={column.key} style={{ textAlign: column.align || 'left' }}>
                    {column.render
                      ? column.render(record[column.key], record, index)
                      : record[column.key]}
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

export default Table;