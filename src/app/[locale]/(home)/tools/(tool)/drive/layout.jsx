"use client";
import useAppContext from "../../../../../../context/app";
import DriveHeader from "./components/DriveHeader";
import ThumbsInfo from "./components/info/thumbs";
import TableInfo from "./components/info/table";
import IconsInfo from "./components/info/icons";

export default function DriveLayout({ children, table, icons, thumbs }) {
  const { driveView } = useAppContext();

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

  return (
    <div className="flex flex-col flex-grow">
      <DriveHeader />
      {children}
      {driveView === "table" && <TableInfo files={files} />}
      {driveView === "icon" && <IconsInfo files={files} />}
      {driveView === "thumb" && <ThumbsInfo files={files} />}
    </div>
  );
}
