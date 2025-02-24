"use client";
import React, { useState, Fragment } from "react";
import useCrmContext from "@/src/context/crm";
import { useTranslation } from "react-i18next";
import { useTeamMeetTable } from "@/src/hooks/useCommon";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import TableHeader from "@/src/components/Table";
import useMeetingsContext from "@/src/context/meetings";
import FooterTable from "@/src/components/FooterTable";
import DeleteItemModal from "@/src/components/modals/DeleteItem";
import SelectedOptionsTable from "@/src/components/SelectedOptionsTable";
import useMeets from "../../hooks/useMeets";
import MeetColumn from "../../meet/components/MeetColumn";

export default function Table() {
  const {
    data,
    limit,
    setLimit,
    setOrderBy,
    order,
    orderBy,
    page,
    setPage,
    mutate,
  } = useMeetingsContext();
  const { t } = useTranslation();
  const { selectedContacts, setSelectedContacts } = useCrmContext();
  const { columnTable } = useTeamMeetTable();
  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );
  const { loading, setLoading, deleteMeet } = useMeets({ type: "teams" });
  const [deleteId, setDeleteId] = useState();
  const [isOpenDeleteMasive, setIsOpenDeleteMasive] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const masiveActions = [
    {
      id: 1,
      name: "Asignar responsable",
      disabled: true,
    },
    {
      id: 1,
      name: "Crear tarea",
      disabled: true,
    },
    {
      id: 1,
      name: t("common:buttons:delete"),
      disabled: true,
    },
  ];

  return (
    <Fragment>
      {loading && <LoaderSpinner />}
      {selectedContacts.length > 0 && (
        <div className="flex py-2">
          <SelectedOptionsTable options={masiveActions} />
        </div>
      )}
      <TableHeader
        selectedRows={selectedContacts}
        setSelectedRows={setSelectedContacts}
        data={data}
        order={order}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        columnTable={columnTable}
      >
        {selectedColumns.length > 0 &&
          data?.items &&
          data?.items.map((meet, index) => {
            return (
              <MeetColumn
                meet={meet}
                key={meet.id}
                selectedContacts={selectedContacts}
                setSelectedContacts={setSelectedContacts}
                selectedColumns={selectedColumns}
                type="teams"
                setDeleteId={setDeleteId}
                setIsOpenDelete={setIsOpenDelete}
              />
            );
          })}
      </TableHeader>

      <div className="w-full pt-4 ">
        <FooterTable
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          totalPages={data?.meta?.totalPages}
          total={data?.meta?.totalItems ?? 0}
        />
      </div>
      <DeleteItemModal
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        handleClick={() => deleteMeet(deleteId)}
        loading={loading}
      />
      <DeleteItemModal
        isOpen={isOpenDeleteMasive}
        setIsOpen={setIsOpenDeleteMasive}
        handleClick={() => deletePolicies()}
        loading={loading}
      />
    </Fragment>
  );
}
