import React from "react";

const TaskTableSkeleton = () => (
  <div className="space-y-3 animate-pulse py-10">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-16 rounded-xl border border-zinc-800/40 bg-zinc-900/10" />
    ))}
  </div>
);

export default TaskTableSkeleton;
