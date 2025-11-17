
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (role: Role, username: string, password: string) => Promise<void>;
    logout: () => void;
}

// FIX: The AuthContext was not exported, causing an error in hooks/useAuth.ts.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, you'd verify a token here
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (role: Role, username: string, password: string) => {
        setLoading(true);
        try {
            const loggedInUser = await api.login(role, username, password);
            setUser(loggedInUser);
            localStorage.setItem('user', JSON.stringify(loggedInUser));
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
