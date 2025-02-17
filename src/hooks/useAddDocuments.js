"use server";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/api/errors";
import {
  addContactDocument,
  addLeadPolicy,
  addReceiptDocument,
} from "@/src/lib/apis";
import { addLeadDocument } from "@/src/lib/apis";

const useAddDocument = ({
  fileName,
  documentType,
  id,
  cmrType,
  onFinished,
  update,
}) => {
  const endpoints = {
    receipt: (data) => addReceiptDocument(id, documentType, data),
    lead: (data) => addLeadDocument(id, documentType, data),
    contact: (data) => addContactDocument(id, documentType, data),
    "poliza-lead": (data) => addLeadPolicy(id, data),
  };
  const handleFormSubmit = async (file) => {
    const formData = new FormData();
    formData.append(fileName ?? "files", file);

    try {
      const response = await endpoints[cmrType](formData);
      console.log({ response });
      if (response?.hasError) {
        let message = response.message;
        if (response.errors) {
          message = response.errors.join(", ");
        }
        throw { message };
      }
      if (response?.client?.fullName) {
        toast.success(
          `Se cargo con éxito póliza con contratante ${response.client.fullName}`
        );
      } else {
        toast.success("Documento agregado con éxito");
      }

      if (response?.warns?.length) {
        toast.warning(response?.warns?.join(", "));
      }
      onFinished && onFinished();
      update && update();
    } catch (error) {
      console.log({ error });
      handleApiError(error);
      onFinished && onFinished();
    }
  };

  return {
    handleFormSubmit,
  };
};

export default useAddDocument;
