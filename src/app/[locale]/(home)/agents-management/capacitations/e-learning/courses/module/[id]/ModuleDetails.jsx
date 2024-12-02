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
  const [openSections, setOpenSections] = React.useState(['overview']);

  const project = projects.find(p => p.id === Number(moduleId));

  if (!project) {
    return <div>Project not found</div>;
  }

  const toggleSection = section => {
    setOpenSections(prev => (prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]));
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-100">
          <AccordionItem title="Module 1" isOpen={openSections.includes('overview')} onToggle={() => toggleSection('overview')}>
            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div className="text-center">
                {/* <Calendar className="w-5 h-5 mx-auto text-gray-400 mb-2" /> */}
                <div className="text-sm font-medium text-gray-900">{project.dueDate}</div>
                <div className="text-xs text-gray-500">Due Date</div>
              </div>
              <div className="text-center">
                {/* <Users className="w-5 h-5 mx-auto text-gray-400 mb-2" /> */}
                <div className="text-sm font-medium text-gray-900">{project.team}</div>
                <div className="text-xs text-gray-500">Team Members</div>
              </div>
              <div className="text-center">
                {/* <BarChart2 className="w-5 h-5 mx-auto text-gray-400 mb-2" /> */}
                <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Module 2" isOpen={openSections.includes('tasks')} onToggle={() => toggleSection('tasks')}>
            <div className="space-y-3">
              {mockTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* <CheckSquare className={`w-5 h-5 ${task.status === 'completed' ? 'text-green-500' : task.status === 'in-progress' ? 'text-blue-500' : 'text-gray-400'}`} /> */}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">Assigned to {task.assignee}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{task.dueDate}</span>
                </div>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="Module 3" isOpen={openSections.includes('updates')} onToggle={() => toggleSection('updates')}>
            <div className="space-y-4">
              {mockUpdates.map(update => (
                <div key={update.id} className="flex gap-3">
                  {/* <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center flex-shrink-0 ${
                        update.type === 'milestone' ? 'from-green-500 to-emerald-500' : update.type === 'change' ? 'from-blue-500 to-indigo-500' : 'from-purple-500 to-pink-500'
                      }`}
                    >
                      {update.type === 'milestone' ? (
                        <CheckSquare className="w-4 h-4 text-white" />
                      ) : update.type === 'change' ? (
                        <FileText className="w-4 h-4 text-white" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-white" />
                      )}
                    </div> */}
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{update.user}</span> {update.message}
                    </p>
                    <p className="text-xs text-gray-500">{update.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionItem>

          <AccordionItem title="Module 4" isOpen={openSections.includes('actions')} onToggle={() => toggleSection('actions')}>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                {/* <MessageSquare className="w-4 h-4" /> */}
                Add Comment
              </button>
              <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                {/* <FileText className="w-4 h-4" /> */}
                Upload Files
              </button>
              <button className="w-full flex items-center gap-2 p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                {/* <Link2 className="w-4 h-4" /> */}
                Share Project
              </button>
            </div>
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
