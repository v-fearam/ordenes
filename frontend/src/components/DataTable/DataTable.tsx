import { useState, useMemo, type ReactNode } from 'react';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  getValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSizes?: number[];
  defaultPageSize?: number;
  emptyMessage?: string;
}

type SortDir = 'asc' | 'desc';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyField,
  searchable = true,
  searchPlaceholder = 'Buscar...',
  pageSizes = [5, 10, 20],
  defaultPageSize = 10,
  emptyMessage = 'No se encontraron resultados.',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Search
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const val = col.getValue ? col.getValue(row) : row[col.key];
        return String(val ?? '').toLowerCase().includes(q);
      }),
    );
  }, [data, search, columns]);

  // Sort
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = col.getValue ? col.getValue(a) : (a[col.key] as string | number);
      const bVal = col.getValue ? col.getValue(b) : (b[col.key] as string | number);
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = typeof aVal === 'number' && typeof bVal === 'number'
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal), 'es');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const paged = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);
  const startIdx = safePage * pageSize + 1;
  const endIdx = Math.min((safePage + 1) * pageSize, sorted.length);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  // Generate page numbers to show
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (safePage > 2) pages.push('ellipsis');
      const start = Math.max(1, safePage - 1);
      const end = Math.min(totalPages - 2, safePage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safePage < totalPages - 3) pages.push('ellipsis');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className={styles.wrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        {searchable && (
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>&#128269;</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        )}
        <div className={styles.pageSize}>
          <span>Mostrar</span>
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          >
            {pageSizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span>por pagina</span>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.sortable !== false ? styles.sortableHeader : undefined}
                  onClick={col.sortable !== false ? () => handleSort(col.key) : undefined}
                >
                  <span className={styles.headerContent}>
                    {col.label}
                    {col.sortable !== false && (
                      <span className={`${styles.sortArrow} ${sortKey === col.key ? styles.active : ''}`}>
                        {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : '▲▼'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length > 0 ? (
              paged.map((row) => (
                <tr key={String(row[keyField])}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.emptyRow}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {sorted.length > 0 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Mostrando {startIdx}-{endIdx} de {sorted.length} resultado{sorted.length !== 1 ? 's' : ''}
          </span>
          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
            >
              &lsaquo;
            </button>
            {getPageNumbers().map((p, i) =>
              p === 'ellipsis' ? (
                <span key={`e${i}`} className={styles.pageBtn} style={{ border: 'none', cursor: 'default' }}>
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${p === safePage ? styles.active : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p + 1}
                </button>
              ),
            )}
            <button
              className={styles.pageBtn}
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage(safePage + 1)}
            >
              &rsaquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
