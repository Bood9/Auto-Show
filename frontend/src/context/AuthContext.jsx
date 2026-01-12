import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/users/dashboard/');
            setUser(prev => ({ ...prev, ...response.data.user }));
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ username: decoded.username || 'User', ...decoded });
                    fetchUserData(); // Fetch full profile including is_superuser
                }
            } catch (error) {
                console.error("Invalid token", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/users/token/', { username, password });
        const { access, refresh } = response.data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        const decoded = jwtDecode(access);
        setUser({ username, ...decoded });
        await fetchUserData(); // Fetch full profile
        return response;
    };

    const register = async (userData) => {
        return await api.post('/users/register/', userData);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
