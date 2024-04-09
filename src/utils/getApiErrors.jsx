// import { signOut } from "next-auth/react";
'use server'
import { toast } from "react-toastify";

export const getApiError = async(error) => {
    switch (error?.status) {
    case 401:
        toastError(error?.message);
        // return await signOut({ callbackUrl: '/' });
    default:
        toastError(error?.message)
        break;
    }
}

const toastError = (message) => {
    toast.error(message, {
        position: "top-right",
    }); 
}