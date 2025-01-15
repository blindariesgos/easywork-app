import React from 'react';
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

import { ModuleProgressBar } from '../../components/CourseProgressBar';
import { AccordionItemMoreMenu } from './AccordionItemMoreMenu';

export const AccordionItem = ({ title, children, isOpen, onToggle, progress, itemType = '', isPrimaryItem = false, actions, isCompleted, onSelect }) => {
  return (
    <div>
      <div onClick={onSelect} className={`cursor-pointer rounded-xl ${isPrimaryItem ? `border-easy-400 bg-easy-50 p-4` : 'bg-white px-2 py-1'}`} style={{ borderWidth: '1px', borderStyle: 'solid' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                if (onToggle) onToggle();
              }}
            >
              {isOpen ? <ChevronUpIcon className="w-6 text-gray-400" aria-hidden="true" /> : <ChevronDownIcon className="w-6 text-gray-400" aria-hidden="true" />}
            </button>

            <span className={`text-gray-900 ${isPrimaryItem && 'font-bold text-lg'}`}>{title}</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            {isCompleted && !isPrimaryItem && <CheckCircleIcon className="w-6 text-green-400" aria-hidden="true" />}
            {itemType && <AccordionItemMoreMenu itemType={itemType} actions={actions} />}
          </div>
        </div>
        {(progress > 0 || isPrimaryItem) && <ModuleProgressBar progress={progress} />}
      </div>

      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div>{children}</div>
      </div>
    </div>
  );
};
