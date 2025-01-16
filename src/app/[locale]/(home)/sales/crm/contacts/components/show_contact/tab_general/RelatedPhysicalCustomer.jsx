import Button from "@/src/components/form/Button";

const RelatedPhysicalCustomer = ({ client }) => {
  return (
    <div
      className="rounded-xl p-2.5"
      style={{
        background:
          "linear-gradient(290.91deg, #FFFFFF 67.75%, #635EA5 206.17%)",
      }}
    >
      <p className="text-lg">Contacto de la compañia</p>
      <p className="text-2xl">{client.fullName}</p>
      <Button buttonStyle="primary" label="Ver cliente" className="px-2 py-4" />
    </div>
  );
};

export default RelatedPhysicalCustomer;
