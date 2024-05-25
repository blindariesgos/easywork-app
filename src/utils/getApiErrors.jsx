// import { signOut } from "next-auth/react";
import { logout } from "../lib/apis";
import { toast } from "react-toastify";

export const getApiError = async (error, errorsDuplicated, server) => {
  console.log(error);
  const errorObject = server
    ? error
    : typeof error === "string"
    ? JSON.parse(error?.message || error.slice(7))
    : error;
  if (!errorsDuplicated?.current) {
    switch (errorObject?.statusCode) {
      case 403:
        toastError(errorObject?.message || errorObject);
        logout();
      case 401:
        // toastError(errorObject?.message || errorObject);
        logout();
      default:
        !server
          ? toastError(errorObject?.message || errorObject)
          : console.log("getApierror", errorObject);
        break;
    }
    if (errorsDuplicated) errorsDuplicated.current = true;
  }
};

const toastError = (message) => {
  toast.error(message, {
    position: "top-right",
  });
};
