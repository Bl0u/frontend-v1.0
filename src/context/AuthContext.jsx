import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);

        // Listen for storage events (triggered by other components)
        const handleStorageChange = () => {
            const updatedUser = localStorage.getItem('user');
            if (updatedUser) {
                setUser(JSON.parse(updatedUser));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Register
    const register = async (formData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
            if (res.data) {
                localStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
                toast.success('Registered successfully');
                return true;
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return false;
        }
    };

    // Login
    const login = async (formData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
            if (res.data) {
                localStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
                toast.success('Logged in successfully');
                return true;
            }
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return false;
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
