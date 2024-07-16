"use client";

import React, { useMemo, useState, useEffect } from "react";
import { DriveContext } from "..";
import { createFolder, getFolder, getFolders, updateFolder } from "../../lib/api/drive";

export default function DriveContextProvider({ children }) {
  const [folders, setFolders] = useState()
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState({
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 25,
    totalPages: 1,
    currentPage: 1
  })

  const [pages, setPages] = useState([])

  const getItems = async () => {
    setLoading(true)
    const response = pages.length == 0
      ? await getFolders().catch((error) => {
        return { error: true }
      })
      : await getFolder(pages[pages.length - 1]?.id).catch((error) => {
        return { error: true }
      })

    if (response.error) {
      return setLoading(false)
    };

    setFolders(response.items ?? [])
    setConfig({
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

  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    getItems()
  }, [pages])

  const values = useMemo(() => ({
    config,
    loading,
    folders,
    pages,
    returnFolder,
    renameFolder,
    addPage,
    addFolder,
    updateFolders: getItems
  }), [folders, config, loading, pages]);

  return <DriveContext.Provider value={values}>{children}</DriveContext.Provider>;
}
