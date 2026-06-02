import { useState } from "react";
import Pagination from "../Elements/Pagination";

const DataTable = ({ columns, data, itemsPerPage = 10, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const actionColumn = {
    header: "Action",
    className: "text-center",
    cellClassName: "text-center text-xl",
    render: (item) => (
      <div className="flex justify-center gap-2">
        {onEdit && (
          <i
            className="bx bx-edit cursor-pointer text-green-700 hover:scale-110 transition-transform"
            onClick={() => onEdit(item)}
            title="Edit"
          ></i>
        )}
        {onDelete && (
          <i
            className="bx bx-trash cursor-pointer text-red-500 hover:scale-110 transition-transform"
            onClick={() => onDelete(item)}
            title="Delete"
          ></i>
        )}
        {!onEdit && !onDelete && (
          <>
            <i className="bx bx-edit cursor-pointer text-green-700 hover:scale-110"></i>
            <i className="bx bx-trash cursor-pointer text-red-500 hover:scale-110"></i>
          </>
        )}
      </div>
    ),
  };

  const allColumns = [...columns, actionColumn];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div>
      <table className="w-full rounded-2xl bg-white overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-center px-4 py-2 text-sm">No</th>
            {allColumns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-2 text-sm ${col.className || "text-start"}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border-r border-gray-200 text-center text-sm">
                {startIndex + index + 1}
              </td>
              {allColumns.map((col, i) => (
                <td
                  key={i}
                  className={`px-4 py-2 border-r text-sm border-gray-200 ${col.cellClassName || ""}`}
                >
                  {col.render
                    ? col.render(item, startIndex + index)
                    : item[col.key]}
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
          Menampilkan {startIndex + 1}–
          {Math.min(startIndex + itemsPerPage, data.length)} dari {data.length}{" "}
          data
        </p>
      )}
    </div>
  );
};

export default DataTable;
