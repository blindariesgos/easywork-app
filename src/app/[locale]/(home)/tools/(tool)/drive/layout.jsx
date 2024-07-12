"use client";
import useAppContext from "../../../../../../context/app";
import DriveHeader from "./components/DriveHeader";
import ThumbsInfo from "./components/info/thumbs";
import TableInfo from "./components/info/table";
import IconsInfo from "./components/info/icons";
import { useLayoutEffect, useRef, useState } from "react";

const files = [
  {
    name: "Anotaciones varias - Documentos adicionales",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Documentos del cliente_ RFC_IFE_Comp de domicilio",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Documentos o textos explicativos",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Póliza emitida",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Presentación o Propuesta Comercial",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Programaciones",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Recibos y Facturas",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Reembolsos",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Rescate",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Siniestros",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Solicitud",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "10 MB",
    mimetype: "folder",
  },
  {
    name: "Proyecto Easy",
    modifiedAt: "26/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "1 MB",
    mimetype: "document",
  },
  {
    name: "Nuevo documento 1",
    modifiedAt: "23/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "14 KB",
    mimetype: "document",
  },
  {
    name: "Curriculum",
    modifiedAt: "23/01/2024",
    modifiedBy: {
      name: "Rosmer Campos",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2&ixlib=rb-1.2.1&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    size: "512 KB",
    mimetype: "pdf",
  },
  // More files...
];

export default function DriveLayout({ children }) {
  const { driveView } = useAppContext();
  const checkbox = useRef();
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useLayoutEffect(() => {
    const isIndeterminate =
      selectedFiles.length > 0 && selectedFiles.length < files.length;
    setChecked(selectedFiles.length === files.length);
    setIndeterminate(isIndeterminate);
    checkbox.current.indeterminate = isIndeterminate;
  }, [selectedFiles]);

  const toggleAll = () => {
    setSelectedFiles(checked || indeterminate ? [] : files);
    setChecked(!checked && !indeterminate);
    setIndeterminate(false);
  }

  const itemOptions = [
    { name: "Abrir" },
    { name: "Compartir" },
    { name: "Renombrar" },
    { name: "Copiar" },
  ];

  const shareOptions = [
    { name: "Compartir enlace interno" },
    { name: "Compartir con otros usuarios" },
  ];

  return (
    <div className="flex flex-col flex-grow">
      <DriveHeader />
      {children}
      {
        driveView === "table" && (
          <TableInfo
            files={files}
            toggleAll={toggleAll}
            itemOptions={itemOptions}
            shareOptions={shareOptions}
            selectedFiles={selectedFiles}
            checkbox={checkbox}
            setSelectedFiles={setSelectedFiles}
            checked={checked}
          />)}
      {
        driveView === "icon" && (
          <IconsInfo
            files={files}
            toggleAll={toggleAll}
            itemOptions={itemOptions}
            shareOptions={shareOptions}
            selectedFiles={selectedFiles}
            checkbox={checkbox}
            setSelectedFiles={setSelectedFiles}
            checked={checked}
          />)
      }
      {
        driveView === "thumb" && (
          <ThumbsInfo
            files={files}
            toggleAll={toggleAll}
            itemOptions={itemOptions}
            shareOptions={shareOptions}
            selectedFiles={selectedFiles}
            checkbox={checkbox}
            setSelectedFiles={setSelectedFiles}
            checked={checked}
          />)
      }

    </div>
  );
}
