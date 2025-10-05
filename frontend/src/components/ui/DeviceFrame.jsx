import React from 'react';

// Simple device preview frame with toggled widths and subtle frame styling
// Usage:
// <DeviceFrame device={device}><YourContent /></DeviceFrame>
const DeviceFrame = ({ device = 'desktop', children }) => {
  const isMobile = device === 'mobile';

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden">
        {/* Top Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-neutral-900">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="ml-3 flex-1 h-6 bg-neutral-800 border border-neutral-700 rounded-full shadow-inner" />
        </div>

        {/* Content area with device width */}
        <div className="w-full bg-neutral-950 p-3">
          <div
            className={
              isMobile
                ? 'mx-auto bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-lg w-[390px] min-h-[700px]'
                : 'mx-auto bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-lg max-w-5xl w-full'
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceFrame;
