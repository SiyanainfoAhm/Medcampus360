import { useState, useMemo, type ReactNode } from 'react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
  sortValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  searchKeys?: (keyof T)[];
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
  dense?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  searchKeys,
  searchPlaceholder = 'Search records...',
  onRowClick,
  pageSize = 10,
  emptyMessage = 'No records match the current filters.',
  dense,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = data;
    if (query.trim() && searchKeys) {
      const q = query.toLowerCase();
      rows = rows.filter((row) => searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q)));
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col?.sortValue) {
        rows = [...rows].sort((a, b) => {
          const av = col.sortValue!(a);
          const bv = col.sortValue!(b);
          const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
          return sortDir === 'asc' ? cmp : -cmp;
        });
      }
    }
    return rows;
  }, [data, query, searchKeys, sortKey, sortDir, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const rows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (col: Column<T>) => {
    if (!col.sortValue) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  return (
    <div className="bg-white border border-line-200 rounded-lg overflow-hidden">
      {searchKeys && (
        <div className="px-4 py-3 border-b border-line-100">
          <div className="relative max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-ink-400">
              <i className="ri-search-line text-sm" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full h-9 pl-9 pr-3 text-sm bg-canvas-50 border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:bg-white"
            />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line-100">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col)}
                  className={`px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap ${col.sortValue ? 'cursor-pointer select-none' : ''}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortValue && sortKey === col.key && (
                      <i className={`text-[10px] ${sortDir === 'asc' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`border-b border-line-50 last:border-0 ${onRowClick ? 'cursor-pointer hover:bg-canvas-50' : 'hover:bg-canvas-50/60'} transition-colors`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 ${dense ? 'py-2' : 'py-2.5'} text-sm text-ink-700 ${col.className || ''}`}>
                    {col.render ? col.render(row) : String(row[col.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <span className="text-sm text-ink-400 flex flex-col items-center gap-2">
                    <i className="ri-inbox-line text-2xl" />
                    {emptyMessage}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filtered.length > pageSize && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-line-100">
          <p className="text-xs text-ink-400">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}-{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-line-200 text-ink-600 hover:bg-canvas-50 disabled:opacity-40"
              aria-label="Previous page"
            >
              <i className="ri-arrow-left-s-line" />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pages || Math.abs(p - safePage) <= 1)
              .reduce<ReactNode[]>((acc, p, i, arr) => {
                if (i > 0 && arr[i - 1] !== p - 1) acc.push(<span key={`gap-${p}`} className="text-xs text-ink-400 px-1">...</span>);
                acc.push(
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-medium rounded-md border ${p === safePage ? 'bg-navy-900 text-white border-navy-900' : 'border-line-200 text-ink-600 hover:bg-canvas-50'}`}
                  >
                    {p}
                  </button>
                );
                return acc;
              }, [])}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={safePage === pages}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-line-200 text-ink-600 hover:bg-canvas-50 disabled:opacity-40"
              aria-label="Next page"
            >
              <i className="ri-arrow-right-s-line" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}