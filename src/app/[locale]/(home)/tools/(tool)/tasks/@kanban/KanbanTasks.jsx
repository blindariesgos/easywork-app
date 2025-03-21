import { Fragment, useEffect, useMemo, useState } from 'react';
import Column from './components/Column';
import { toast } from 'react-toastify';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import LoaderSpinner from '@/src/components/LoaderSpinner';
import Card from './components/Card';
import { createPortal } from 'react-dom';
import useAppContext from '@/src/context/app';
import { putReceipt } from '@/src/lib/apis';
import moment from 'moment';
import SelectedOptionsTable from '@/src/components/SelectedOptionsTable';
import useCrmContext from '@/src/context/crm';
import { deleteTask as apiDeleteTask, putTaskCompleted, putTaskId, putTaskIdRelations } from '@/src/lib/apis';
import { useTranslation } from 'react-i18next';
import { useTasks } from '@/src/lib/api/hooks/tasks';

const KanbanTasks = () => {
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const { data } = useTasks({ filters: {}, config: { page: 1, limit: 10 } });
  const [itemDrag, setItemDrag] = useState();
  const [updateStages, setUpdateStages] = useState([]);
  const { selectedContacts: selectedReceipts } = useCrmContext();
  const utcOffset = moment().utcOffset();
  const newDeadlineTask = {
    deadline: moment().subtract(1, 'day').format(),
    today: moment().hour(17).second(0).format(),
    thisweek: moment().endOf('week').hour(17).second(0).format(),
    nextweek: moment().endOf('week').add(7, 'days').hour(17).second(0).format(),
    notdate: 'undefined',
    nextsecondweek: moment().endOf('week').add(29, 'days').hour(17).second(0).format(),
  };

  const handleDragEnd = async result => {
    setActiveId(null);
    setIsDragging(false);
    setLoading(true);
    setItemDrag(null);
    // console.log({ result, newDeadlineTask });

    const body = {
      deadline: newDeadlineTask[result?.over?.id],
    };

    try {
      const response = await putTaskId(result?.active?.id, body);
      // console.log({ response });
      if (response.hasError) {
        toast.error('Se ha producido un error al actualizar la tarea, inténtelo de nuevo.');
        setLoading(false);
        return;
      }
      toast.success(t('tools:tasks:update-msg'));
      setUpdateStages([result?.active?.data?.current?.stageId, result?.over?.id]);
    } catch (error) {
      console.log({ error });
      toast.error('Se ha producido un error al actualizar la tarea, inténtelo de nuevo.');
    }
    setLoading(false);
  };

  function handleDragStart(event) {
    setActiveId(event.active.id);
    setIsDragging(true);
  }

  const items = [
    {
      id: 'deadline',
      primary: '#E96200',
      secondary: '#FFEEE2',
      // primary: "#241F61",
      // secondary: "#EDECFF",
      filter: {
        status: 'overdue',
        isCompleted: false,
      },
    },
    {
      id: 'today',
      primary: '#70B900',
      secondary: '#F7FFEB',
      filter: {
        deadline: [
          moment().utc().startOf('day').subtract(utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
          moment().utc().endOf('day').subtract(utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        ],
      },
    },
    {
      id: 'thisweek',
      primary: '#86bedf',
      secondary: '#e3f7ff',
      filter: {
        deadline: [
          moment().utc().add(1, 'days').startOf('day').subtract(utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
          moment().utc().endOf('week').endOf('day').subtract(utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        ],
      },
    },
    {
      id: 'nextweek',
      primary: '#0F8BBF',
      secondary: '#E3F7FF',
      filter: {
        deadline: [
          moment().endOf('week').add(1, 'days').startOf('day').subtract(utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
          moment().endOf('week').add(7, 'days').endOf('day').subtract(utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        ],
      },
    },
    {
      id: 'notdate',
      primary: '#A3A3A3',
      secondary: '#FFFFFF',
      filter: {
        deadline: '',
      },
    },
    {
      id: 'nextsecondweek',
      primary: '#5bc9c2',
      secondary: '#dbfaf8',
      filter: {
        deadline: [
          moment().utc().endOf('week').add(8, 'days').startOf('day').subtract(utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
          moment().utc().endOf('week').add(70, 'days').endOf('day').subtract(utcOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
        ],
      },
    },
  ];

  //#region MASIVE ACTIONS
  const deleteTasks = async () => {
    try {
      setLoading(true);
      if (selectedTasks.length === 1) {
        await apiDeleteTask(selectedTasks[0]);
      } else if (selectedTasks.length > 1) {
        await Promise.all(selectedTasks.map(task => apiDeleteTask(task)));
      }
      toast.success(t('tools:tasks:table:delete-msg'));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t('tools:tasks:table:delete-error'));
    } finally {
      setLoading(false);
      onCloseAlertDialog();
      mutateTasks && mutateTasks();
    }
  };

  const completedTasks = async () => {
    try {
      setLoading(true);
      await Promise.all(selectedTasks.map(taskId => putTaskCompleted(taskId)));
      toast.success(t('tools:tasks:table:completed-msg'));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t('tools:tasks:table:completed-error'));
    } finally {
      setLoading(false);
      onCloseAlertDialog();
      mutateTasks && mutateTasks();
    }
  };

  const addRelationTasks = async (user, relation) => {
    try {
      setLoading(true);
      const body = {
        usersIds: [user.id],
        relation,
      };

      await Promise.all(selectedTasks.map(taskId => putTaskIdRelations(taskId, body)));
      toast.success(t('tools:tasks:table:responsible-msg'));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t('tools:tasks:table:responsible-error'));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeResponsibleTasks = async responsible => {
    try {
      setLoading(true);
      const body = {
        responsibleIds: [responsible.id],
      };

      await Promise.all(selectedTasks.map(taskId => putTaskId(taskId, body)));
      toast.success(t('tools:tasks:table:responsible-msg'));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t('tools:tasks:table:responsible-error'));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeCreatorTasks = async creator => {
    try {
      setLoading(true);
      const body = {
        createdById: creator.id,
      };

      await Promise.all(selectedTasks.map(taskId => putTaskId(taskId, body)));
      toast.success(t('tools:tasks:table:responsible-msg'));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t('tools:tasks:table:responsible-error'));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeDeadlineTasks = async deadline => {
    try {
      setLoading(true);

      const body = {
        deadline: getFormatDate(deadline),
      };

      await Promise.all(selectedTasks.map(taskId => putTaskId(taskId, body)));
      toast.success(t('tools:tasks:table:responsible-msg'));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t('tools:tasks:table:responsible-error'));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const masiveActions = [
    {
      id: 1,
      name: t('common:table:checkbox:complete'),
      onclick: () => completedTasks(),
    },
    {
      id: 2,
      name: t('common:table:checkbox:add-observer'),
      selectUser: true,
      onclick: e => addRelationTasks(e, 'observadores'),
    },
    {
      id: 3,
      name: t('common:table:checkbox:add-participant'),
      selectUser: true,
      onclick: e => addRelationTasks(e, 'participantes'),
    },
    {
      id: 4,
      name: t('common:table:checkbox:change-creator'),
      selectUser: true,
      onclick: e => changeCreatorTasks(e),
    },
    {
      id: 5,
      name: t('common:table:checkbox:change-deadline'),
      selectDate: true,
      onclick: e => changeDeadlineTasks(e),
    },
    {
      id: 2,
      name: t('common:table:checkbox:change-responsible'),
      selectUser: true,
      onclick: e => changeResponsibleTasks(e),
    },
    {
      id: 6,
      name: t('common:table:checkbox:delete'),
      onclick: () => deleteTasks(),
    },
  ];

  //#endregion

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      {selectedReceipts.length > 0 && (
        <div className="flex flex-col justify-start gap-2 items-start pb-2">
          <SelectedOptionsTable options={masiveActions} />
        </div>
      )}
      <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <div className="overflow-x-auto">
          <div className="grid grid-cols-6 min-w-full w-max gap-2">
            {items?.map(column => (
              <Column
                key={column.id}
                id={column.id}
                color={column}
                title={t(`tools:tasks:kanban:${column.id}`)}
                activeId={activeId}
                setItemDrag={setItemDrag}
                updateStages={updateStages}
                setUpdateStages={setUpdateStages}
                filter={column.filter}
              />
            ))}
          </div>
        </div>

        <DragOverlay>{activeId && itemDrag ? <Card task={itemDrag} minWidthClass="240px" /> : null}</DragOverlay>
      </DndContext>
    </Fragment>
  );
};

export default KanbanTasks;
