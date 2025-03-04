import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const login = async (username, password) => {
        try {
            // Send the POST request to the backend
            const response = await axios.post("http://localhost:9999/api/auth/login", {username, password}, { withCredentials: true });
            return response.data;
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post("http://localhost:9999/api/auth/logout", {}, { withCredentials: true });
            return response.data;
          } catch (error) {
            console.error('Logout failed', error);
          }
    };

    return (
        <UserContext.Provider value={{ login, logout }}>
            {children}
        </UserContext.Provider>
    );
}