import DriveContexProvider from "../../../../../../context/drive/provider"


export default function DriveLayout({ children }) {

  return (
    <DriveContexProvider>
      {children}
    </DriveContexProvider>
  );
}
