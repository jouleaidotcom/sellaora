import React from 'react';

// Lightweight preview skeleton used while AI is generating updates
const PreviewSkeleton = () => {
  return (
    <div className="animate-pulse p-4 space-y-4">
      <div className="h-4 w-40 bg-neutral-800 rounded" />
      <div className="h-40 bg-neutral-800 rounded-xl" />
      <div className="h-10 bg-neutral-800 rounded-lg" />
      <div className="h-48 bg-neutral-800 rounded-xl" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-24 bg-neutral-800 rounded-lg" />
        <div className="h-24 bg-neutral-800 rounded-lg" />
        <div className="h-24 bg-neutral-800 rounded-lg" />
      </div>
    </div>
  );
};

export default PreviewSkeleton;
