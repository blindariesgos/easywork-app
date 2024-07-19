"use client";

import React, { useMemo, useState, useEffect } from "react";
import { DriveContext } from "..";
import { createFolder, copyFolder, getExplorer, updateFolder, uploadFiles, copyFile } from "../../lib/api/drive";
import { toast } from "react-toastify";

export default function DriveContextProvider({ children }) {
  const [folders, setFolders] = useState()
  const [loading, setLoading] = useState(true)
  const [folderCopy, setFolderCopy] = useState()
  const [isOpenCopy, setIsOpenCopy] = useState(false)
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

  const [pages, setPages] = useState([])

  const getItems = async () => {
    setLoading(true)
    const response = await getExplorer(config, pages.length == 0 ? "" : pages[pages.length - 1]?.id)

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
      .catch((error) => {
        console.log({ error })
        return {
          error: true
        }
      })

    if (response.error) {
      return setLoading(false)
    }

    await getItems()
    setLoading(false)

  }

  const renameFolder = async (id, name) => {
    setLoading(true)
    const response = await updateFolder(id, { name }).catch((error) => {
      console.log(error)
      return { error: true }
    })
    if (response.error) {
      return setLoading(false)
    }
    await getItems()
    setLoading(false)
  }

  const duplicateFolder = async (newName) => {
    setLoading(true)
    const response = folderCopy.type === "folder"
      ? await copyFolder(folderCopy.id, { newName }, pages[pages.length - 1]?.id ?? null)
      : await copyFile(folderCopy.id, { newName }, pages[pages.length - 1]?.id ?? null)

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

    setFolderCopy()
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
      .catch((error) => {
        return {
          error: true,
          message: error.message
        }
      })

    if (response.error) {
      toast.error(response.message)
      setLoading(false);
      return
    }

    await getItems()
    setLoading(false)
  }

  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    getItems()
  }, [pages, config])

  const values = useMemo(() => ({
    config,
    loading,
    folders,
    pages,
    totals,
    folderCopy,
    isOpenCopy,
    currentFolder: pages[pages.length - 1],
    addFiles,
    setIsOpenCopy,
    setFolderCopy,
    setConfig,
    returnFolder,
    renameFolder,
    addPage,
    addFolder,
    updateFolders: getItems,
    duplicateFolder
  }), [folders, config, loading, pages, totals, folderCopy, isOpenCopy]);

  return <DriveContext.Provider value={values}>{children}</DriveContext.Provider>;
}
