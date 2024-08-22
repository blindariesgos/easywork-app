import FilterTableContextProvider from "../../context/filters-table/provider";
import Filters from "./Filters";

const FilterTable = ({ contextValues }) => {
  return (
    <FilterTableContextProvider contextValues={contextValues}>
      <Filters />
    </FilterTableContextProvider>
  );
};

export default FilterTable;
