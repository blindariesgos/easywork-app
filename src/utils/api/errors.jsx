// src/utils/api/errors.js

import { logout } from "../../lib/apis";
import { toast } from "react-toastify";
import { getLogger } from "../logger";

const logger = getLogger("Error Handler");

export const handleApiError = async (error, errorsDuplicated) => {
  // Determine if the error occurred on the server or client
  const isServerSide = typeof window === "undefined"; // Checks for window object

  let errorObject = error;

  // If on server, parse error as needed
  if (isServerSide && typeof error === "string") {
    try {
      errorObject = JSON.parse(error?.message || error.slice(7));
    } catch (parseError) {
      logger.error("Failed to parse server error:", parseError);
    }
  }

  // If not a duplicate error and not being handled by axios interceptor...
  if (!errorsDuplicated?.current) {
    switch (errorObject?.statusCode) {
      case 403:
        isServerSide
          ? logger.error("Forbidden Access (403):", errorObject)
          : toastError(errorObject?.message || errorObject);
        logout();
        break;
      case 401:
        isServerSide
          ? logger.error("Unauthorized (401):", errorObject)
          : logout();
        break;
      default:
        isServerSide
          ? logger.error("API Error:", errorObject)
          : toastError(errorObject?.message || "An error occurred");
    }

    if (errorsDuplicated) errorsDuplicated.current = true;
  }
};

const toastError = (message) => {
  toast.error(message, {
    position: "top-right",
  });
};
