'use client';
import React from 'react';
// import { ArrowLeft, Calendar, Users, BarChart2, MessageSquare, FileText, Link2, CheckSquare } from 'lucide-react';
import { projects } from '../../mocks';
import { AccordionItem } from '../components/AccordionItem';
import { ModuleContent } from '../components/ModuleContent';

const mockTasks = [
  { id: 1, title: 'Design system implementation', status: 'completed', assignee: 'Sarah Chen', dueDate: 'Oct 15, 2024' },
  { id: 2, title: 'User research and interviews', status: 'in-progress', assignee: 'Marcus Rodriguez', dueDate: 'Oct 20, 2024' },
  { id: 3, title: 'Prototype development', status: 'in-progress', assignee: 'Emily Parker', dueDate: 'Oct 25, 2024' },
  { id: 4, title: 'Stakeholder presentation', status: 'todo', assignee: 'Alex Johnson', dueDate: 'Nov 1, 2024' },
];

const mockUpdates = [
  { id: 1, user: 'Sarah Chen', message: 'Completed the initial design system setup', timestamp: '2 hours ago', type: 'milestone' },
  { id: 2, user: 'Marcus Rodriguez', message: 'Updated the user interview questions', timestamp: '4 hours ago', type: 'change' },
  { id: 3, user: 'Emily Parker', message: 'Great progress on the design system!', timestamp: '1 day ago', type: 'comment' },
];

export const ModuleDetails = ({ moduleId, onBack }) => {
  const [openSections, setOpenSections] = React.useState(['']);

  const project = projects.find(p => p.id === Number(moduleId));

  if (!project) {
    return <div>Project not found</div>;
  }

  const toggleSection = section => {
    setOpenSections(prev => (prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]));
  };

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
            project={project}
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
