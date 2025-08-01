import React, { useState } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';
import Pagination from "./Pagination";

export default function Section({ title, count, show, setShow, headers, extraHeader, renderNew, children, pageSizeOptions = [5, 10, 15, 20] }) {
  // Paginación mínima
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSizeOptions[0]);
  const startIdx = (page - 1) * rowsPerPage;
  const endIdx = startIdx + rowsPerPage;
  const rows = React.Children.toArray(children);
  const paginatedRows = rows.slice(startIdx, endIdx);

  return (
    <div>
      {extraHeader && extraHeader()}
      <button className="font-bold text-xl" onClick={() => setShow(!show)}>
        ({count}) {title} {show ? <ChevronUp className="inline"/> : <ChevronDown className="inline"/>}
      </button>
      {show && (
        <>
          <div className="overflow-x-auto max-h-72 overflow-y-auto border border-gray-300 rounded-md">
            <table className="min-w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>{headers.map(h => <th key={h} className="border px-2 py-1">{h}</th>)}</tr>
              </thead>
              <tbody>
                {renderNew && renderNew()}
                {paginatedRows}
              </tbody>
            </table>
          </div>
          <Pagination
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            pageSizeOptions={pageSizeOptions}
          />
        </>
      )}
    </div>
  );
}
