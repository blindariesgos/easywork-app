import React from 'react';

import ModuleProgressBar from '../../../components/ModuleProgressBar';
// import { ChevronDown } from 'lucide-react';

export const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button onClick={onToggle} className="w-full p-4 text-left">
        <span className="text-lg font-medium text-gray-900">{title}</span>
        {/* <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} /> */}
        <ModuleProgressBar progress={25} />
      </button>

      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0">{children}</div>
      </div>
    </div>
  );
};
