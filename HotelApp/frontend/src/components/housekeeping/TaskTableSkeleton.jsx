import React from "react";

const TaskTableSkeleton = () => (
  <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm animate-pulse">
    <table className="w-full text-left text-xs border-collapse">
      <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border-b border-zinc-200">
        <tr>
          <th className="p-4">Kamar</th>
          <th className="p-4">Jenis Tugas</th>
          <th className="p-4">Prioritas</th>
          <th className="p-4">Status</th>
          <th className="p-4">Assigned Staff</th>
          <th className="p-4">Catatan / Keterangan</th>
          <th className="p-4 text-right">Aksi</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-200">
        {[...Array(5)].map((_, i) => (
          <tr key={i} className="h-[72px]">
            <td className="p-4">
              <div className="h-4.5 w-16 bg-zinc-200/80 rounded-md" />
              <div className="h-3 w-28 bg-zinc-150 rounded mt-2" />
            </td>
            <td className="p-4">
              <div className="h-5 w-20 bg-zinc-200/80 rounded-md" />
            </td>
            <td className="p-4">
              <div className="h-5 w-14 bg-zinc-200/80 rounded-md" />
            </td>
            <td className="p-4">
              <div className="h-5.5 w-24 bg-zinc-200/80 rounded-full" />
            </td>
            <td className="p-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3.5 w-3.5 bg-zinc-200/80 rounded-full" />
                <div className="h-3.5 w-24 bg-zinc-200/80 rounded" />
              </div>
            </td>
            <td className="p-4">
              <div className="h-3 w-36 bg-zinc-200/80 rounded" />
              <div className="h-2.5 w-20 bg-zinc-150 rounded mt-1.5" />
            </td>
            <td className="p-4 text-right">
              <div className="h-8 w-16 bg-zinc-200/80 rounded-lg ml-auto" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TaskTableSkeleton;
