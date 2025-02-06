'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { toast } from 'react-toastify';
import { FaUserCheck, FaCircleCheck } from 'react-icons/fa6';

import Button from '@/src/components/form/Button';

import { useCourses } from '../hooks/useCourses';
import useAppContext from '@/src/context/app';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
// import { useDebouncedCallback } from 'use-debounce';

export const AssignCourseModal = ({ course, isOpen, setIsOpen, onSuccess }) => {
  const router = useRouter();
  const { assignCourse, getCourseById } = useCourses({ fetchOnMount: false });
  const { lists } = useAppContext();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersAlreadyAssigned, setUsersAlreadyAssigned] = useState([]);
  const [courseDetails, setCourseDetails] = useState(course);

  const thereAreSelectedUsers = selectedUsers.length > 0;

  const onCloseModal = () => {
    setIsOpen(false);
  };

  const onSave = async () => {
    try {
      await assignCourse(course.id, { userIds: selectedUsers });
      toast.success('Curso asignado exitosamente!');

      localStorage.setItem(course.id, JSON.stringify({ ...courseDetails, assignTo: lists?.users?.filter(user => isUserSelected(user.id)), assignedBy: session.user }));
      router.push(`/tools/tasks/task?show=true&prev=course-assign&prev_id=${course.id}`);
    } catch (error) {
      toast.error('Algo no ha salido muy bien. Por favor intente más tarde');
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

  const isUserAlreadyAssigned = id => usersAlreadyAssigned.includes(id);

  const toggleSelectedUser = user => {
    if (isUserSelected(user.id)) {
      setSelectedUsers(prev => prev.filter(id => id !== user.id));
    } else {
      // setSelectedUsers(prev => [...prev, user.id]);
      setSelectedUsers(prev => [user.id]);
    }
  };

  const fetchCourseDetails = useCallback(async () => {
    if (!course) return;

    try {
      const result = await getCourseById(course.id);
      setCourseDetails(result);
      const { assignedUsers } = result;
      setUsersAlreadyAssigned(assignedUsers.map(assignedUser => assignedUser.user.id));
    } catch (error) {
      toast.error('Estamos teniendo problemas para obtener el detalle del curso a asignar. Por favor intenta más tarde');
    }
  }, [course, getCourseById]);

  useEffect(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

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
                  ?.filter(user => filterUsers(user, search))
                  .map(user => {
                    const isSelected = isUserSelected(user.id);
                    const isAlreadyAssigned = isUserAlreadyAssigned(user.id);

                    // if (isAlreadyAssigned) return null;

                    return (
                      <div
                        key={user.id}
                        className={`max-h-[55px] max-w-[315px] flex items-center rounded-md ${isSelected ? 'bg-[#e0e0e0]' : 'bg-[#f5f5f5]'} p-2 ${!isSelected && !isAlreadyAssigned ? 'hover:bg-primary/10' : ''} ${isAlreadyAssigned ? '' : 'cursor-pointer'}`}
                        onClick={() => {
                          if (!isAlreadyAssigned) {
                            toggleSelectedUser(user);
                          }
                        }}
                      >
                        {user.avatar && <Image src={user.avatar} width={150} height={150} alt={`${user.name} avatar`} className="w-10 h-10 rounded-full mr-2" />}
                        <div className="relative w-full">
                          {isAlreadyAssigned && <FaCircleCheck size="20px" className="absolute top-0 right-0 text-green-500" />}
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
            <Button
              label={loading ? 'Guardando...' : 'Asignar'}
              type="button"
              buttonStyle="primary"
              className={`px-2 py-1 text-lg ${thereAreSelectedUsers ? '' : 'opacity-60'}`}
              onclick={onSave}
              disabled={loading || !thereAreSelectedUsers}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
