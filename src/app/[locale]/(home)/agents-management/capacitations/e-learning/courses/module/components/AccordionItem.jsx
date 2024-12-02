import React from 'react';

import ModuleProgressBar from '../../../components/ModuleProgressBar';
// import { ChevronDown } from 'lucide-react';

export const AccordionItem = ({ title, children, isOpen, onToggle, progress, childrenClassName = 'p-4 pt-0', titleBordered = true, isPrimaryItem = false }) => {
  return (
    <div className={`${isPrimaryItem ? '' : 'my-2'}`}>
      <button
        onClick={onToggle}
        className={`bg-white w-full p-4 text-left rounded-md ${titleBordered ? 'rounded-md' : ''} ${isPrimaryItem ? `border-easy-400` : ''}`}
        style={{ borderWidth: '1px', borderStyle: 'solid' }}
      >
        <span className={`text-lg font-medium text-gray-900 ${progress ? 'mb-2 block w-full' : ''}`}>{title}</span>
        {progress && <ModuleProgressBar progress={progress} />}
      </button>

      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`${isPrimaryItem ? 'pt-2' : 'pt-2'} ${childrenClassName}`}>{children}</div>
      </div>
    </div>
  );
};
