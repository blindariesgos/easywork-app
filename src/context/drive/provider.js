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
  moveItem
} from "../../lib/api/drive";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function DriveContextProvider({ children }) {
  const { t } = useTranslation()
  const [folders, setFolders] = useState()
  const [loading, setLoading] = useState(true)
  const [itemCopy, setItemCopy] = useState()
  const [itemMove, setItemMove] = useState()
  const [itemEdit, setItemEdit] = useState()
  const [isOpenCopy, setIsOpenCopy] = useState(false)
  const [isOpenMove, setIsOpenMove] = useState(false)
  const [isOpenRename, setIsOpenRename] = useState(false)
  const [filters, setFilters] = useState({})
  const [displayFilters, setDisplayFilters] = useState({})
  const [itemDelete, setItemDelete] = useState()
  const [config, setConfig] = useState({
    limit: 25,
    page: 1,
    sortField: 'name',
    sortOrder: 'ASC'
  })
  const [totals, setTotals] = useState({
    totalItems: 0,
    itemCount: 0,
    totalPages: 1,
  })
  const [filterFields, setFilterFields] = useState([
    {
      id: 2,
      name: t('contacts:filters:currentFolder'),
      type: 'select',
      options: [
        {
          name: "Si",
          id: 0,
          value: true
        },
        {
          name: "No",
          id: 1,
          value: false
        }
      ],
      check: false,
      code: "currentFolder"
    },
    {
      id: 3,
      name: t('contacts:filters:created'),
      type: 'date',
      check: false,
      code: "createdDate"
    },
    {
      id: 4,
      name: t('contacts:filters:modified'),
      type: 'date',
      check: false,
      code: "modifiedDate"
    },
  ]);

  const [pages, setPages] = useState([])

  const getItems = async () => {
    setLoading(true)
    const response = await getExplorer(config, filters, pages.length == 0 ? "" : pages[pages.length - 1]?.id)

    if (response.error) {
      toast.error(response.message)
      return setLoading(false)
    };

    setFolders(response.items ?? [])
    setTotals({
      ...config,
      ...response.meta
    })
    setLoading(false)
  }

  const addFolder = async (name) => {

    setLoading(true)
    let data = { name }
    if (pages.length > 0) {
      data = {
        ...data,
        parentId: pages[pages.length - 1]?.id
      }
    }

    const response = await createFolder(data)

    if (response.error) {
      toast.error(response.message)
      return setLoading(false)
    }

    await getItems()
    setLoading(false)

  }

  const renameItem = async (newName) => {
    setLoading(true)
    const response = itemEdit.type === "folder"
      ? await renameFolder(itemEdit.id, { newName })
      : await renameFile(itemEdit.id, { newName })

    if (response.error) {
      toast.error(response.message)
      return setLoading(false)
    }

    setIsOpenRename(false)
    await getItems()
    setLoading(false)
  }

  const duplicateFolder = async (newName) => {
    setLoading(true)

    const itemType = itemCopy.type === "folder" ? "folders" : "files";
    const response = await copyItem(itemType, itemCopy.id, { newName }, pages[pages.length - 1]?.id ?? null)

    if (response.error) {
      toast.error(response.message)
      return setLoading(false)
    }

    if (response.errors) {
      response.errors.forEach(error => {
        toast.error(error)
      })
      return setLoading(false)
    }

    setIsOpenCopy(false)
    setItemCopy()
    await getItems()
    setLoading(false)
  }

  const moveFolder = async () => {
    setLoading(true)

    const itemType = itemMove.type === "folder" ? "folders" : "files";
    const response = await moveItem(itemType, itemMove.id, pages[pages.length - 1]?.id ?? null)

    if (response.error) {
      toast.error(response.message)
      return setLoading(false)
    }

    if (response.errors) {
      response.errors.forEach(error => {
        toast.error(error)
      })
      return setLoading(false)
    }

    setIsOpenMove(false)
    setItemMove()
    await getItems()
    setLoading(false)
  }

  const returnFolder = (index) => {
    setPages(pages.filter((_, i) => i <= index))
  }

  const addPage = async (data) => {
    setPages([
      ...pages,
      {
        name: data.name,
        id: data.id
      }
    ])
  }

  const addFiles = async (files) => {
    setLoading(true)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file, file.name)
    })

    const response = await uploadFiles(pages[pages.length - 1]?.id, formData)

    if (response.error) {
      toast.error(response.message)
      setLoading(false);
      return
    }

    await getItems()
    setLoading(false)
  }

  const removeFilter = (filterName) => {
    const newFilters = Object.keys(filters)
      .filter((key) => key !== filterName)
      .reduce((acc, key) => ({ ...acc, [key]: filters[key] }), {})

    setFilters(newFilters)
    setDisplayFilters(displayFilters.filter(filter => filter.code !== filterName))
    const newFilterFields = filterFields.map(field => {
      return filterName !== field.code
        ? field
        : { ...field, check: false }
    })
    setFilterFields(newFilterFields)
  }

  const deleteFolder = async () => {
    setLoading(true)
    const itemType = itemDelete.type === "folder" ? "folders" : "files";
    const response = await deleteItem(itemType, itemDelete.id)

    if (response.error) {
      toast.error(response.message)
      return setLoading(false)
    }

    if (response.errors) {
      response.errors.forEach(error => {
        toast.error(error)
      })
      return setLoading(false)
    }

    setItemDelete()
    await getItems()
    setLoading(false)
  }

  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    getItems()
  }, [pages, config, filters])



  const values = useMemo(() => ({
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
    setDeleteItem: setItemDelete
  }), [
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
  ]);

  return <DriveContext.Provider value={values}>{children}</DriveContext.Provider>;
}
