import CustomImportContextProvider from "../../../../../context/custom-import/provider";
import CustomImport from "./CustomImport";

const page = () => {
  return (
    <CustomImportContextProvider>
      <CustomImport />
    </CustomImportContextProvider>
  );
};

export default page;
