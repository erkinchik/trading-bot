import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { message } from 'antd';

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
            setToken(storedToken);
        }
        setIsLoading(false);
    }, []);


    const login = (newToken: string) => {
        localStorage.setItem('access_token', newToken);
        setToken(newToken);
        messageApi.success('Login successful!');
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setToken(null);
        messageApi.info('You have been logged out');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout, isLoading }}>
            {contextHolder}
            {children}
        </AuthContext.Provider>

    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
