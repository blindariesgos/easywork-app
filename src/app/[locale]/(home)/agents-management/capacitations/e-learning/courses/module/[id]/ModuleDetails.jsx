'use client';

import { useState, useEffect } from 'react';
import { AccordionItem } from '../components/AccordionItem';
import { ModuleContent } from '../components/ModuleContent';
import { getCourseById } from '../../services/get-courses';

export const ModuleDetails = ({ moduleId }) => {
  const [openSections, setOpenSections] = useState(['']);
  const [course, setCourse] = useState(null);

  const toggleSection = section => {
    setOpenSections(prev => (prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]));
  };

  useEffect(() => {
    getCourseById(moduleId).then(setCourse).catch(console.log);
  }, [moduleId]);

  if (!course) {
    return <div>Module not found</div>;
  }
  return (
    <div className="py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-xl border border-gray-100">
          <AccordionItem title="Module 1" isPrimaryItem isOpen={openSections.includes('overview')} onToggle={() => toggleSection('overview')} progress={25} childrenClassName="p-0">
            <AccordionItem
              title="Ciclo de ventas"
              isOpen={openSections.includes('sales-cicle')}
              onToggle={() => toggleSection('sales-cicle')}
              childrenClassName="p-0"
              titleBordered={false}
              borderColor="border-gray-300"
            >
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md my-1">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
            </AccordionItem>
            <AccordionItem title="Intro GNP" isOpen={openSections.includes('gnp')} onToggle={() => toggleSection('gnp')} childrenClassName="p-0" titleBordered={false} borderColor="border-gray-300">
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md my-1">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
            </AccordionItem>
            <AccordionItem
              title="Productos y comisiones"
              isOpen={openSections.includes('products')}
              onToggle={() => toggleSection('products')}
              childrenClassName="p-0"
              titleBordered={false}
              borderColor="border-gray-300"
            >
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md my-1">Capitulo III</p>
              <p className="bg-gray-600 text-black p-4 w-full rounded-md">Capitulo III</p>
            </AccordionItem>
          </AccordionItem>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <ModuleContent
            course={course}
            onNavigate={id => {
              setOpenSections(['overview']);
              projectId = id;
            }}
          />
        </div>
      </div>
    </div>
  );
};
