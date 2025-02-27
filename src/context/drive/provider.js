"use client";

import React, { useMemo, useState, useEffect } from "react";
import { DriveContext } from "..";
import {
  createFolder,
  getExplorer,
  uploadFiles,
  copyItem,
  renameFolder,
  renameFile,
  deleteItem,
  moveItem,
  getFolder,
  assignCRMContact,
} from "../../lib/api/drive";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import useAppContext from "../app";

export default function DriveContextProvider({ children }) {
  const { t } = useTranslation();
  const [isOpenConnect, setIsOpenConnect] = useState(false);
  const [folderConnect, setFolderConnect] = useState();
  const [folders, setFolders] = useState();
  const [loading, setLoading] = useState(true);
  const [itemCopy, setItemCopy] = useState();
  const [itemMove, setItemMove] = useState();
  const [itemEdit, setItemEdit] = useState();
  const [isOpenCopy, setIsOpenCopy] = useState(false);
  const [isOpenMove, setIsOpenMove] = useState(false);
  const [isOpenRename, setIsOpenRename] = useState(false);
  const [filters, setFilters] = useState({});
  const [displayFilters, setDisplayFilters] = useState({});
  const [itemDelete, setItemDelete] = useState();
  const searchParams = useSearchParams();
  const { lists } = useAppContext();
  const params = new URLSearchParams(searchParams);
  const [config, setConfig] = useState({
    limit: 5,
    page: 1,
    sortField: "name",
    sortOrder: "ASC",
  });
  const [totals, setTotals] = useState({
    totalItems: 0,
    itemCount: 0,
    totalPages: 1,
  });
  const [filterFields, setFilterFields] = useState([]);
  const [externalFolderInfo, setExternalFolderInfo] = useState();

  const [pages, setPages] = useState([]);

  useEffect(() => {
    setFilterFields([
      {
        id: 2,
        name: t("contacts:filters:currentFolder"),
        type: "select",
        options: [
          {
            name: "Si",
            id: 0,
            value: true,
          },
          {
            name: "No",
            id: 1,
            value: false,
          },
        ],
        check: false,
        code: "currentFolder",
      },
      {
        id: 3,
        name: t("contacts:filters:created"),
        type: "date",
        check: false,
        code: "createdDate",
      },
      {
        id: 4,
        name: t("contacts:filters:modified"),
        type: "date",
        check: false,
        code: "modifiedDate",
      },
      {
        id: 5,
        name: t("contacts:filters:created-by"),
        type: "select-user",
        check: false,
        code: "createdby",
      },
    ]);
  }, [lists?.users]);

  const getExternalFolderInfo = async (folderId) => {
    const response = await getFolder(folderId);
    if (response.error) {
      toast.error(response.message);
      return setLoading(false);
    }
    setExternalFolderInfo(response);
  };

  const getItems = async () => {
    setLoading(true);
    const externalFolder = params.get("folder");
    const folder =
      externalFolder && pages.length == 0
        ? externalFolder
        : pages.length == 0
          ? ""
          : pages[pages.length - 1]?.id;
    const response = await getExplorer(config, filters, folder);

    if (response.hasError) {
      toast.error(response.message);
      return setLoading(false);
    }

    setFolders(response.items ?? []);
    setTotals({
      ...config,
      ...response.meta,
    });

    if (externalFolder && !externalFolderInfo) {
      await getExternalFolderInfo(externalFolder);
    }
    setLoading(false);
  };

  const addFolder = async (name) => {
    setLoading(true);
    let data = { name };
    if (pages.length > 0) {
      data = {
        ...data,
        parentId: pages[pages.length - 1]?.id,
      };
    }

    const response = await createFolder(data);

    if (response.error) {
      toast.error(response.message);
      return setLoading(false);
    }

    await getItems();
    setLoading(false);
  };

  const renameItem = async (newName) => {
    setLoading(true);
    const response =
      itemEdit.type === "folder"
        ? await renameFolder(itemEdit.id, { newName })
        : await renameFile(itemEdit.id, { newName });

    if (response.error) {
      toast.error(response.message);
      return setLoading(false);
    }

    setIsOpenRename(false);
    await getItems();
    setLoading(false);
  };

  const duplicateFolder = async (newName) => {
    setLoading(true);

    const itemType = itemCopy.type === "folder" ? "folders" : "files";
    const response = await copyItem(
      itemType,
      itemCopy.id,
      { newName },
      pages[pages.length - 1]?.id ?? null
    );

    if (response.error) {
      toast.error(response.message);
      return setLoading(false);
    }

    if (response.errors) {
      response.errors.forEach((error) => {
        toast.error(error);
      });
      return setLoading(false);
    }

    setIsOpenCopy(false);
    setItemCopy();
    await getItems();
    setLoading(false);
  };

  const moveFolder = async () => {
    setLoading(true);

    const itemType = itemMove.type === "folder" ? "folders" : "files";
    const response = await moveItem(
      itemType,
      itemMove.id,
      pages[pages.length - 1]?.id ?? null
    );

    if (response.error) {
      toast.error(response.message);
      return setLoading(false);
    }

    if (response.errors) {
      response.errors.forEach((error) => {
        toast.error(error);
      });
      return setLoading(false);
    }

    setIsOpenMove(false);
    setItemMove();
    await getItems();
    setLoading(false);
  };

  const returnFolder = (index) => {
    setPages(pages.filter((_, i) => i <= index));
  };

  const addPage = async (data) => {
    setPages([
      ...pages,
      {
        name:
          data?.metadata?.observableName ??
          data?.metadata?.showName ??
          data.name,
        id: data.id,
      },
    ]);
    setConfig({
      ...config,
      page: 1,
    });
    setFilters({});
  };

  const addFiles = async (files) => {
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file, file.name);
    });

    const response = await uploadFiles(pages[pages.length - 1]?.id, formData);

    if (response.error) {
      toast.error(response.message);
      setLoading(false);
      return;
    }

    await getItems();
    setLoading(false);
  };

  const removeFilter = (filterName) => {
    const newFilters = Object.keys(filters)
      .filter((key) => key !== filterName)
      .reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {});

    setFilters(newFilters);
    setDisplayFilters(
      displayFilters.filter((filter) => filter.code !== filterName)
    );
    const newFilterFields = filterFields.map((field) => {
      return filterName !== field.code ? field : { ...field, check: false };
    });
    setFilterFields(newFilterFields);
  };

  const deleteFolder = async () => {
    setLoading(true);
    const itemType = itemDelete.type === "folder" ? "folders" : "files";
    const response = await deleteItem(itemType, itemDelete.id);

    if (response.error) {
      toast.error(response.message);
      return setLoading(false);
    }

    if (response.errors) {
      response.errors.forEach((error) => {
        toast.error(error);
      });
      return setLoading(false);
    }

    setItemDelete();
    await getItems();
    setLoading(false);
  };

  const connectCRMContact = async (contact) => {
    const id = toast.loading(
      `Vinculando carpeta ${folderConnect?.name} a cliente ${contact?.name}`
    );
    const response = await assignCRMContact(folderConnect.id, contact.id);
    if (response?.statusCode == 500) {
      toast.update(id, {
        render: "Error al vincular cliente",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      return;
    }
    toast.update(id, {
      render: "Cliente vinculado satisfactoriamente",
      type: "success",
      isLoading: false,
      autoClose: 5000,
    });
    setIsOpenConnect(false);
    await getItems();
    return response;
  };

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    getItems();
  }, [pages, config, filters]);

  const handleChangeConfig = (key, value) => {
    let newConfig = {
      ...config,
      [key]: value,
    };
    if (value == config.orderBy) {
      newConfig = {
        ...newConfig,
        order:
          value != config.orderBy
            ? "DESC"
            : config.order === "ASC"
              ? "DESC"
              : "ASC",
      };
    }

    setConfig(newConfig);
  };

  const values = useMemo(
    () => ({
      config,
      loading,
      folders,
      pages,
      totals,
      folderCopy: itemCopy,
      isOpenCopy,
      currentFolder: pages[pages.length - 1],
      isOpenRename,
      itemEdit,
      filters,
      displayFilters,
      filterFields,
      itemMove,
      isOpenMove,
      externalFolderInfo,
      isOpenConnect,
      folderConnect,
      page: config.page,
      setPage: (value) => handleChangeConfig("page", value),
      limit: config.limit,
      setLimit: (value) => handleChangeConfig("limit", value),
      orderBy: config.orderBy,
      setOrderBy: (value) => handleChangeConfig("orderBy", value),
      order: config.order,
      setOrder: (value) => handleChangeConfig("order", value),
      connectCRMContact,
      setFolderConnect,
      setIsOpenConnect,
      setIsOpenMove,
      moveFolder,
      setItemMove,
      deleteFolder,
      setFilterFields,
      setDisplayFilters,
      setFilters,
      setItemEdit,
      setIsOpenRename,
      addFiles,
      setIsOpenCopy,
      setFolderCopy: setItemCopy,
      setConfig,
      returnFolder,
      renameItem,
      addPage,
      addFolder,
      updateFolders: getItems,
      duplicateFolder,
      removeFilter,
      deleteItem: itemDelete,
      setDeleteItem: setItemDelete,
    }),
    [
      config,
      loading,
      folders,
      pages,
      totals,
      itemCopy,
      isOpenCopy,
      isOpenRename,
      itemEdit,
      filters,
      displayFilters,
      filterFields,
      itemDelete,
      itemMove,
      isOpenMove,
      externalFolderInfo,
      isOpenConnect,
      folderConnect,
    ]
  );

  return (
    <DriveContext.Provider value={values}>{children}</DriveContext.Provider>
  );
}
