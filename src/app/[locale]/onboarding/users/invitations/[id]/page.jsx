const Page = async ({ params }) => {
  const { id } = params;
  return <div>Aquí se deben ver las invitaciones. ID: {id}</div>;
};

export default Page;
