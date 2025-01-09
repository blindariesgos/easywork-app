import React from 'react';

export default function ModuleProgressBar({ progress }) {
  return (
    <div className="w-full h-7 bg-gray-200 rounded-full overflow-hidden mt-2">
      <div className="h-full bg-blue-300 rounded-full transition-all duration-500 flex items-center" style={{ width: progress > 0 ? `${progress}%` : '0px' }}>
        <p className={`${Number(progress) > 2 ? 'text-white' : 'text-black'} px-5`}>{progress}%</p>
      </div>
    </div>
  );
}
