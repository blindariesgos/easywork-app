'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-toastify';

import Button from '@/src/components/form/Button';

import { useCourses } from '../hooks/useCourses';
import useAppContext from '@/src/context/app';
import Image from 'next/image';
// import { useDebouncedCallback } from 'use-debounce';

export const AssignCourseModal = ({ course, isOpen, setIsOpen, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { assignCourse } = useCourses({ fetchOnMount: false });
  const { lists } = useAppContext();
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const onCloseModal = () => setIsOpen(false);

  const onSave = async () => {
    setLoading(true);

    try {
      // await assignCourse({ courseId: course.id, userIds: selectedUsers });

      toast.success('Curso asignado exitosamente!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Algo no ha salido muy bien. Por favor intente más tarde');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = value => setSearch(value);

  const filterUsers = (user, search) => {
    if (!search) return user;

    return Object.entries(user).some(([key, value]) => {
      if (['name', 'email'].includes(key)) {
        return value.toLowerCase().includes(search.toLowerCase());
      }

      return false;
    });
  };

  const isUserSelected = id => selectedUsers.includes(id);

  const toggleSelectedUser = user => {
    if (isUserSelected(user.id)) {
      setSelectedUsers(prev => prev.filter(id => id !== user.id));
    } else {
      setSelectedUsers(prev => [...prev, user.id]);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onCloseModal} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-2 ">
        <DialogPanel className="min-w-96 md:w-[700px] p-6 rounded-xl bg-gray-100">
          <DialogTitle className="text-lg">
            Curso: <span className="text-easy-400 font-bold">{course?.name}</span>
          </DialogTitle>

          <div className="my-5">
            <label className="text-sm">Asignar a:</label>
            <input
              type="text"
              placeholder="Buscar persona a asignar..."
              className="mt-1 w-full resize-none outline-none focus:outline-none focus-visible:outline-none focus-within:outline-none rounded-md placeholder:text-xs focus:ring-0 text-sm border  focus:ring-gray-200 focus:outline-0"
              disabled={loading}
              onChange={e => handleSearch(e.target.value)}
              value={search}
            />
          </div>

          <div className="mb-5">
            <p className="text-sm">Personas</p>

            <div className="bg-white py-2 rounded-lg px-2 mt-2">
              <div className="rounded-lg grid grid-cols-1 md:grid-cols-2 gap-2 h-[250px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {lists?.users
                  .filter(user => filterUsers(user, search))
                  .map(user => {
                    const isSelected = isUserSelected(user.id);

                    return (
                      <div
                        key={user.id}
                        className={`max-h-[55px] max-w-[315px] flex items-center cursor-pointer rounded-md ${isSelected ? 'bg-[#e0e0e0]' : 'bg-[#f5f5f5]'} p-2 ${!isSelected ? 'hover:bg-primary/10' : ''}`}
                        onClick={() => toggleSelectedUser(user)}
                      >
                        {user.avatar && <Image src={user.avatar} width={150} height={150} alt={`${user.name} avatar`} className="w-10 h-10 rounded-full mr-2" />}
                        <div>
                          <p className={`text-black`}>{user.name || user.username}</p>
                          <p className={`text-xs text-gray-400`}>{user.email}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button label="Cancelar" type="button" buttonStyle="secondary" className="px-2 py-1 text-lg" onclick={onCloseModal} disabled={loading} />
            <Button label={loading ? 'Guardando...' : 'Asignar'} type="button" buttonStyle="primary" className="px-2 py-1 text-lg" onclick={onSave} disabled={loading} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
