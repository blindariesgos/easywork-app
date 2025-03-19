import SalesCrmResult from "./SalesCrmResult";

const page = ({ params: { id, jobId } }) => {
  if (["leads", "contacts"].includes(id)) {
    return <SalesCrmResult crmType={id} jobId={jobId} />;
  }
  return (
    <h1>
      {id}/{jobId}
    </h1>
  );
};

export default page;
