import { createContext, useContext, useState } from "react";

export const DataContext = createContext();

export function DataContextProvider(props) {
    const [contextData, setContextData] = useState(0);
    const [otpToken, setOtpToken] = useState(null);

    const value = {
        contextData,
        setContextData,
        otpToken,
        setOtpToken
    };


    return (
        <DataContext.Provider value={value}>
            {props.children}
        </DataContext.Provider>
    )
}

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('Error')
    }
    return context
}