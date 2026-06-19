import React from "react";

const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-16 rounded-xl border border-zinc-200 bg-zinc-100/50" />
    ))}
  </div>
);

export default TableSkeleton;
