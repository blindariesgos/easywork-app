import React from 'react';

import ModuleProgressBar from '../../../components/ModuleProgressBar';
import AccordionItemMoreMenu from './LessonMoreMenu';
// import { ChevronDown } from 'lucide-react';

export const AccordionItem = ({ title, children, isOpen, onToggle, progress, itemType = '', isPrimaryItem = false, actions }) => {
  return (
    <div>
      <div onClick={onToggle} className={`cursor-pointer rounded-xl ${isPrimaryItem ? `border-easy-400 bg-easy-50 p-4` : 'bg-white px-2 py-1'}`} style={{ borderWidth: '1px', borderStyle: 'solid' }}>
        <div className="flex items-center justify-between">
          <span className={`text-gray-900 ${isPrimaryItem && 'font-bold text-lg'}`}>{title}</span>
          {itemType && <AccordionItemMoreMenu itemType={itemType} actions={actions} />}
        </div>
        {progress && <ModuleProgressBar progress={progress} />}
      </div>

      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div>{children}</div>
      </div>
    </div>
  );
};
