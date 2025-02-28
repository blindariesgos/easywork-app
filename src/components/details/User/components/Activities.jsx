import { useUserActivities } from "@/src/lib/api/hooks/users";
import { useEffect, useState, Fragment } from "react";
import Table from "@/src/components/Table";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import FooterTable from "@/src/components/FooterTable";
import { useUserActivitiesTable } from "@/src/hooks/useCommon";

export const Activities = ({ userId }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const { data } = useUserActivities({
    config: {
      page,
      limit,
    },
    userId,
  });

  const { columnTable } = useUserActivitiesTable();
  const [loading, setLoading] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState(
    columnTable.filter((c) => c.check)
  );

  useEffect(() => {
    console.log({ data });
  }, [data]);

  return (
    <Fragment>
      {selectedColumns && selectedColumns.length > 0 && (
        <div className="flow-root">
          {loading && <LoaderSpinner />}
          <div className="min-w-full">
            <Table
              data={data}
              order={"ASC"}
              orderBy={"name"}
              setOrderBy={() => {}}
              selectedColumns={selectedColumns}
              setSelectedColumns={setSelectedColumns}
              columnTable={columnTable}
            ></Table>
          </div>
          <div className="w-full mt-2">
            <FooterTable
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              totalPages={data?.meta?.totalPages}
              total={data?.meta?.totalItems ?? 0}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};
