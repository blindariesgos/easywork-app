// import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

export const getApiError = async(error, errorsDuplicated, server) => {
    const errorObject = server ? error : typeof(error) === "string" ? JSON.parse(error?.message || error.slice(7)) : error;
    if (!errorsDuplicated?.current) {     
        switch (errorObject?.statusCode) {
            case 401:
                toastError(errorObject?.message || errorObject);
            default:
                !server ? toastError(errorObject?.message || errorObject) : console.log("getApierror", errorObject)
                break;
        }    
        if (errorsDuplicated) errorsDuplicated.current = true;
    }
}

const toastError = (message) => {
    toast.error(message, {
        position: "top-right",
    }); 
}