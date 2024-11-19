"use client";
import CustomImportContextProvider from "../../../../../context/custom-import/provider";
import CustomImport from "./CustomImport";

const page = ({ params: { id } }) => {
  return (
    <CustomImportContextProvider>
      <CustomImport type={id} />
    </CustomImportContextProvider>
  );
};

export default page;
