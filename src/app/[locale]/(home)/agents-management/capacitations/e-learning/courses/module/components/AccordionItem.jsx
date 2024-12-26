import React from 'react';

import ModuleProgressBar from '../../../components/ModuleProgressBar';
import AccordionItemMoreMenu from './LessonMoreMenu';
// import { ChevronDown } from 'lucide-react';

export const AccordionItem = ({ title, children, isOpen, onToggle, progress, itemType = '', isPrimaryItem = false, actions }) => {
  return (
    <div className={`relative my-0.5`}>
      {/* <div className={`${isPrimaryItem ? '' : 'my-2'} relative`}> */}
      {itemType && <AccordionItemMoreMenu itemType={itemType} actions={actions} />}

      <div
        onClick={onToggle}
        className={`cursor-pointer w-full text-left relative ${isPrimaryItem ? `border-easy-400 rounded-xl bg-easy-50 p-4` : 'bg-white rounded-md p-2'}`}
        style={{ borderWidth: '1px', borderStyle: 'solid' }}
      >
        <span className={`text-gray-900 ${isPrimaryItem ? 'font-bold text-lg ' : ''} ${progress ? 'mb-2 block w-full' : ''}`}>{title}</span>
        {progress && <ModuleProgressBar progress={progress} />}
      </div>

      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`${isPrimaryItem ? 'py-1' : 'py-2'}`}>{children}</div>
      </div>
    </div>
  );
};
