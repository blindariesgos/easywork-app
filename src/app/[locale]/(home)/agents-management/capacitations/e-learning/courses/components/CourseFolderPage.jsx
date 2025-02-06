import React from 'react';
import { AccordionItemMoreMenu } from './AccordionItemMoreMenu';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useUserPermissions } from '../../../hooks/useUserPermissions';
import { LMS_PERMISSIONS } from '../../../constants';

export const CourseFolderPage = ({ page, onSelectPage, isSelected, editPage, duplicatePage, changeCourseFolder, deletePage, addTask, isCompleted }) => {
  const { hasPermission } = useUserPermissions();
  return (
    <div className={`flex items-center justify-between cursor-pointer bg-[#eaeaea] px-2 py-1 rounded-xl mt-1.5`} onClick={onSelectPage}>
      <p className={`${isSelected ? 'font-bold' : ''} text-black`}>{page.name}</p>
      <div className="flex items-center justify-center gap-2">
        {hasPermission(LMS_PERMISSIONS.markAsCompleted) && isCompleted && <CheckCircleIcon className="w-6 text-green-400" aria-hidden="true" />}
        {hasPermission(LMS_PERMISSIONS.coursesMoreMenu) && <AccordionItemMoreMenu itemType="page" actions={{ editPage, duplicatePage, changeCourseFolder, addTask, deletePage }} />}
      </div>
    </div>
  );
};
