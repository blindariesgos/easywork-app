import React from 'react';

export default function ModuleProgressBar({ progress }) {
  return (
    <div className="w-full h-7 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-blue-300 rounded-full transition-all duration-500 flex items-center px-5" style={{ width: `${progress}%` }}>
        <p className={`${Number(progress) > 2 ? 'text-white' : 'text-black'}`}>{progress}%</p>
      </div>
    </div>
  );
}
