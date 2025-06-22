import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
    showLoading: () => {},
    hideLoading: () => {},
    isLoading: false,
});

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = () => setIsLoading(true);
    const hideLoading = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
