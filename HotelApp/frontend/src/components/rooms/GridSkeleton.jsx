import React from "react";

const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
    {[...Array(18)].map((_, i) => (
      <div key={i} className="rounded-2xl border border-zinc-800/50 bg-zinc-900 p-4 animate-pulse h-28" />
    ))}
  </div>
);

export default GridSkeleton;
