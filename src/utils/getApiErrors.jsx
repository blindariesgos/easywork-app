// import { signOut } from "next-auth/react";
import { toast } from "react-toastify";

export const getApiError = async(error, errorsDuplicated) => {
    const errorObject = JSON.parse(error?.message || error.slice(7));
    if (!errorsDuplicated?.current) {     
        switch (errorObject?.statusCode) {
            case 401:
                toastError(errorObject?.message || errorObject);
                // return await signOut({ callbackUrl: '/' });
            default:
                console.log("entre")
                toastError(errorObject?.message || errorObject)
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