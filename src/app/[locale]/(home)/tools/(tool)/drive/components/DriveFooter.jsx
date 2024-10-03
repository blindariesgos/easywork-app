"use client";
import useDriveContext from "@/src/context/drive";
import FooterTable from "@/src/components/FooterTable";
import { Fragment } from "react";

const DriveFooter = ({ selectedFiles }) => {
  const { totals, page, limit, setPage, setLimit } = useDriveContext();

  return (
    <Fragment>
      {selectedFiles > 0 && (
        <div>
          Seleccionado: {selectedFiles}/{totals.totalItems}
        </div>
      )}
      <FooterTable
        limit={limit}
        setLimit={setLimit}
        page={page}
        setPage={setPage}
        totalPages={totals.totalPages}
        total={totals.totalItems ?? 0}
      />
    </Fragment>
  );
};

export default DriveFooter;
