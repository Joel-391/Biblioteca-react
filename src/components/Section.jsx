import React from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Section({ title, count, show, setShow, headers, extraHeader, renderNew, children }) {
  return (
    <div>
      {extraHeader && extraHeader()}
      <button className="font-bold text-xl" onClick={() => setShow(!show)}>
        ({count}) {title} {show ? <ChevronUp className="inline"/> : <ChevronDown className="inline"/>}
      </button>
      {show && (
        <div className="overflow-x-auto max-h-72 overflow-y-auto border border-gray-300 rounded-md">
          <table className="min-w-full">
            <thead className="bg-gray-100 sticky top-0">
              <tr>{headers.map(h => <th key={h} className="border px-2 py-1">{h}</th>)}</tr>
            </thead>
            <tbody>
              {renderNew && renderNew()}
              {children}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
