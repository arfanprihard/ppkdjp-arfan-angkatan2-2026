import React from "react";

const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-16 rounded-xl border border-zinc-800/40 bg-zinc-900/10" />
    ))}
  </div>
);

export default TableSkeleton;
