import React from "react";

const UserSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 h-[190px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <div className="h-4 bg-zinc-800 rounded-md w-full" />
              <div className="h-3 bg-zinc-800 rounded-md w-1/2" />
            </div>
            <div className="h-5 bg-zinc-800 rounded-lg w-16" />
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="h-3 bg-zinc-800 rounded-md w-3/4" />
            <div className="h-3 bg-zinc-800 rounded-md w-2/3" />
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-zinc-800/60 pt-3">
          <div className="h-7 bg-zinc-800 rounded-lg w-16" />
          <div className="h-7 bg-zinc-800 rounded-lg w-20" />
        </div>
      </div>
    ))}
  </div>
);

export default UserSkeleton;
