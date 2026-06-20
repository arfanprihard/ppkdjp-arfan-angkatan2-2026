import React from "react";

const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
    {[...Array(18)].map((_, i) => (
      <div
        key={i}
        className="relative w-full rounded-2xl border border-zinc-200/80 bg-white p-4 animate-pulse h-28 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="h-5 w-10 bg-zinc-250/70 rounded-lg" />
            <div className="h-3 w-16 bg-zinc-150 rounded mt-1.5" />
          </div>
          <div className="h-5.5 w-16 bg-zinc-200/70 rounded-lg" />
        </div>
        <div>
          <div className="h-3.5 w-24 bg-zinc-200/70 rounded" />
          <div className="h-3 w-20 bg-zinc-150 rounded mt-1.5" />
        </div>
      </div>
    ))}
  </div>
);

export default GridSkeleton;
