import { useState } from "react";
import Pagination from "../Elements/Pagination";
const DataTable = ({ columns, data, itemsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <table className="w-full rounded-2xl bg-white overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-center px-4 py-2">No</th>
            {columns.map((col, i) => (
              <th key={i} className={`px-4 py-2 ${col.className || "text-start"}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border-r border-gray-200 text-center">
                {startIndex + index + 1}
              </td>
              {columns.map((col, i) => (
                <td key={i} className={`px-4 py-2 border-r border-gray-200 ${col.cellClassName || ""}`}>
                  {col.render ? col.render(item, startIndex + index) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalItems={data.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {data.length > 0 && (
        <p className="text-center text-sm text-gray-500 mt-1">
          Menampilkan {startIndex + 1}–{Math.min(startIndex + itemsPerPage, data.length)} dari {data.length} data
        </p>
      )}
    </div>
  );
};

export default DataTable;
