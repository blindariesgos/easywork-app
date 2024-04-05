"use client";
import useAppContext from "@/context/app";
import DriveHeader from "./components/DriveHeader";

export default function DriveLayout({ children, table, icons, thumbs }) {
  const { driveView } = useAppContext();
  return (
    <div className="flex flex-col flex-grow">
      <DriveHeader />
      {children}
      {driveView === "table" && table}
      {driveView === "icon" && icons}
      {driveView === "thumb" && thumbs}
    </div>
  );
}
