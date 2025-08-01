import React from "react";
import { ChevronDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  count,
  pageSizeOptions = [5, 10, 15, 20],
  className = ""
}) {
  const totalPages = Math.ceil(count / rowsPerPage);
  return (
    <div className={`flex items-center justify-between flex-wrap gap-2 py-2 ${className}`}>
      {/* Selector de filas por página */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-sm">Filas:</span>
        <div className="relative">
          <select
            className="appearance-none border rounded px-3 py-1 pr-8 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={rowsPerPage}
            onChange={e => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            aria-label="Filas por página"
          >
            {pageSizeOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 focus:outline-none" tabIndex={-1} aria-hidden="true">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Barra de navegación de páginas */}
      <nav className="flex items-center gap-1" aria-label="Paginación">
        <button
          className="border rounded px-2 py-1 font-semibold text-sm hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(1)}
          disabled={page === 1}
          aria-label="Primera página"
        >
          <ChevronsLeft size={18} />
        </button>
        <button
          className="border rounded px-2 py-1 font-semibold text-sm hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Página anterior"
        >
          <ChevronLeft size={18} />
        </button>
        {/* Números de página */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 10).map(pn => (
          <button
            key={pn}
            className={`border rounded px-2 py-1 font-semibold text-sm ${pn === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
            onClick={() => setPage(pn)}
            aria-current={pn === page ? 'page' : undefined}
          >
            {pn}
          </button>
        ))}
        <button
          className="border rounded px-2 py-1 font-semibold text-sm hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
          aria-label="Página siguiente"
        >
          <ChevronRight size={18} />
        </button>
        <button
          className="border rounded px-2 py-1 font-semibold text-sm hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages || totalPages === 0}
          aria-label="Última página"
        >
          <ChevronsRight size={18} />
        </button>
      </nav>
    </div>
  );
}
