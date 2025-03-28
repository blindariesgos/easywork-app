"use client";

import React, { useState, Fragment } from "react";
import { useTasksConfigs } from "@/src/hooks/useCommon";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import Table from "@/src/components/Table";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import FooterTable from "@/src/components/FooterTable";
import {
  deleteTask as apiDeleteTask,
  putTaskCompleted,
  putTaskId,
  putTaskIdRelations,
} from "@/src/lib/apis";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useTasksContext from "@/src/context/tasks";
import { getFormatDate } from "@/src/utils/getFormatDate";
import Task from "./Task";
import DeleteModal from "@/src/components/modals/DeleteItem";

export default function TableTask() {
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpenDeleteMasive, setIsOpenDeleteMasive] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const {
    tasks: data,
    mutate: mutateTasks,
    selectedTasks,
    setSelectedTasks,
    limit,
    setLimit,
    page,
    setPage,
    order,
    orderBy,
    setOrderBy,
  } = useTasksContext();

  const { columnTable } = useTasksConfigs();
  const [loading, setLoading] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );

  const { t } = useTranslation();

  //#region MASIVE ACTIONS

  const deleteTasks = async () => {
    try {
      setLoading(true);
      if (selectedTasks.length === 1) {
        await apiDeleteTask(selectedTasks[0]);
      } else if (selectedTasks.length > 1) {
        await Promise.all(selectedTasks.map((task) => apiDeleteTask(task)));
      }
      toast.success(t("tools:tasks:table:delete-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:delete-error"));
    } finally {
      setLoading(false);
      onCloseAlertDialog();
      mutateTasks && mutateTasks();
    }
  };

  const completedTasks = async () => {
    try {
      setLoading(true);
      await Promise.all(
        selectedTasks.map((taskId) => putTaskCompleted(taskId))
      );
      toast.success(t("tools:tasks:table:completed-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:completed-error"));
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

      await Promise.all(
        selectedTasks.map((taskId) => putTaskIdRelations(taskId, body))
      );
      toast.success(t("tools:tasks:table:responsible-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:responsible-error"));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeResponsibleTasks = async (responsible) => {
    try {
      setLoading(true);
      const body = {
        responsibleIds: [responsible.id],
      };

      await Promise.all(selectedTasks.map((taskId) => putTaskId(taskId, body)));
      toast.success(t("tools:tasks:table:responsible-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:responsible-error"));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeCreatorTasks = async (creator) => {
    try {
      setLoading(true);
      const body = {
        createdById: creator.id,
      };

      await Promise.all(selectedTasks.map((taskId) => putTaskId(taskId, body)));
      toast.success(t("tools:tasks:table:responsible-msg"));
      setSelectedTasks([]);
    } catch (error) {
      toast.error(t("tools:tasks:table:responsible-error"));
    } finally {
      setLoading(false);
      mutateTasks && mutateTasks();
    }
  };

  const changeDeadlineTasks = async (deadline) => {
    try {
      setLoading(true);

      const body = {
        deadline: getFormatDate(deadline),
      };

      await Promise.all(selectedTasks.map((taskId) => putTaskId(taskId, body)));
      toast.success(t("tools:tasks:table:responsible-msg"));
      setSelectedTasks([]);
      mutateTasks && mutateTasks();
      setIsOpenDeleteMasive(false);
    } catch (error) {
      toast.error(t("tools:tasks:table:responsible-error"));
    } finally {
      setLoading(false);
    }
  };

  const masiveActions = [
    {
      id: 1,
      name: t("common:table:checkbox:complete"),
      onclick: () => completedTasks(),
    },
    {
      id: 2,
      name: t("common:table:checkbox:add-observer"),
      selectUser: true,
      onclick: (e) => addRelationTasks(e, "observadores"),
    },
    {
      id: 3,
      name: t("common:table:checkbox:add-participant"),
      selectUser: true,
      onclick: (e) => addRelationTasks(e, "participantes"),
    },
    {
      id: 4,
      name: t("common:table:checkbox:change-creator"),
      selectUser: true,
      onclick: (e) => changeCreatorTasks(e),
    },
    {
      id: 5,
      name: t("common:table:checkbox:change-deadline"),
      selectDate: true,
      onclick: (e) => changeDeadlineTasks(e),
    },
    {
      id: 2,
      name: t("common:table:checkbox:change-responsible"),
      selectUser: true,
      onclick: (e) => changeResponsibleTasks(e),
    },
    {
      id: 6,
      name: t("common:table:checkbox:delete"),
      onclick: (id) => setIsOpenDeleteMasive(true),
    },
  ];

  const handleDeleteTask = async (id) => {
    try {
      setLoading(true);
      await apiDeleteTask(id);
      toast.success(t("tools:tasks:table:delete-msg"));
      mutateTasks && mutateTasks();
      setIsOpenDelete(false);
    } catch {
      toast.error(t("tools:tasks:table:delete-error"));
    }
    setLoading(false);
  };

  //#endregion

  return (
    <Fragment>
      {selectedColumns && selectedColumns.length > 0 && (
        <div className="flow-root">
          {loading && <LoaderSpinner />}
          <div className="min-w-full">
            {selectedTasks.length > 0 && (
              <div className="p-2 flex">
                <SelectedOptionsTable options={masiveActions} />
              </div>
            )}
            <Table
              selectedRows={selectedTasks}
              setSelectedRows={setSelectedTasks}
              data={data}
              order={order}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              columnTable={columnTable}
            >
              {selectedColumns.length > 0 &&
                data?.items?.length > 0 &&
                data?.items?.map((task, index) => (
                  <Task
                    key={task.id}
                    task={task}
                    selectedColumns={selectedColumns}
                    selectedTasks={selectedTasks}
                    setSelectedTasks={setSelectedTasks}
                    setDeleteId={setDeleteId}
                    setIsOpenDelete={setIsOpenDelete}
                  />
                ))}
            </Table>
          </div>
          <div className="w-full mt-2">
            <FooterTable
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              totalPages={data?.meta?.totalPages}
              total={data?.meta?.totalItems ?? 0}
            />
          </div>
        </div>
      )}
      {/* Delete ConfirmModal */}
      <DeleteModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={() => handleDeleteTask(deleteId)}
      />

      <DeleteModal
        isOpen={isOpenDeleteMasive}
        setIsOpen={setIsOpenDeleteMasive}
        handleClick={() => deleteTasks()}
      />
    </Fragment>
  );
}
