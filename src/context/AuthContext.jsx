import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            try {
                const storedSessions = localStorage.getItem('sessions');
                const activeIndex = localStorage.getItem('activeSessionIndex');
                const legacyUser = localStorage.getItem('user');

                if (storedSessions) {
                    const parsedSessions = JSON.parse(storedSessions);
                    if (Array.isArray(parsedSessions)) {
                        setSessions(parsedSessions);
                        const index = parseInt(activeIndex) || 0;
                        if (parsedSessions[index]) {
                            setUser(parsedSessions[index]);
                        }
                    } else {
                        // If it's not an array, it's corrupted or legacy
                        localStorage.removeItem('sessions');
                    }
                } else if (legacyUser) {
                    // Migrate legacy single-user session
                    try {
                        const parsedUser = JSON.parse(legacyUser);
                        if (parsedUser && parsedUser.token) {
                            const initialSessions = [parsedUser];
                            setSessions(initialSessions);
                            setUser(parsedUser);
                            localStorage.setItem('sessions', JSON.stringify(initialSessions));
                            localStorage.setItem('activeSessionIndex', '0');
                            localStorage.removeItem('user');
                        }
                    } catch (e) {
                        localStorage.removeItem('user');
                    }
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                localStorage.removeItem('sessions');
                localStorage.removeItem('activeSessionIndex');
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        const handleStorageChange = () => {
            try {
                const updatedSessions = localStorage.getItem('sessions');
                const updatedActiveIndex = localStorage.getItem('activeSessionIndex');
                if (updatedSessions) {
                    const parsed = JSON.parse(updatedSessions);
                    if (Array.isArray(parsed)) {
                        setSessions(parsed);
                        const index = parseInt(updatedActiveIndex) || 0;
                        if (parsed[index]) {
                            setUser(parsed[index]);
                        }
                    }
                }
            } catch (e) {
                console.error('Storage sync error:', e);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Helper to update sessions and active user
    const updateSessions = (newSessions, activeIndex) => {
        localStorage.setItem('sessions', JSON.stringify(newSessions));
        localStorage.setItem('activeSessionIndex', activeIndex.toString());
        setSessions(newSessions);
        setUser(newSessions[activeIndex] || null);
    };

    // Register
    const register = async (formData) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
            if (res.data) {
                const newSessions = [...sessions, res.data];
                updateSessions(newSessions, newSessions.length - 1);
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
                // Check if user already has a session
                const existingIndex = sessions.findIndex(s => s._id === res.data._id);
                let newSessions;
                let newIndex;

                if (existingIndex !== -1) {
                    newSessions = [...sessions];
                    newSessions[existingIndex] = res.data; // Update data
                    newIndex = existingIndex;
                } else {
                    newSessions = [...sessions, res.data];
                    newIndex = newSessions.length - 1;
                }

                updateSessions(newSessions, newIndex);
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

    // Switch Session
    const switchSession = (index) => {
        if (sessions[index]) {
            localStorage.setItem('activeSessionIndex', index.toString());
            toast.info(`Switched to ${sessions[index].username}`);
            setTimeout(() => {
                window.location.reload();
            }, 500); // Small delay to let toast show
        }
    };

    // Logout specific session
    const logout = (index) => {
        const targetIndex = typeof index === 'number' ? index : sessions.findIndex(s => s._id === user?._id);
        if (targetIndex === -1) return;

        const newSessions = sessions.filter((_, i) => i !== targetIndex);

        if (newSessions.length === 0) {
            localStorage.removeItem('sessions');
            localStorage.removeItem('activeSessionIndex');
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } else {
            // If we've logged out the active session, switch to the first one
            const activeIndex = localStorage.getItem('activeSessionIndex');
            let nextIndex = parseInt(activeIndex);

            if (nextIndex === targetIndex) {
                nextIndex = 0;
            } else if (nextIndex > targetIndex) {
                nextIndex--;
            }

            localStorage.setItem('sessions', JSON.stringify(newSessions));
            localStorage.setItem('activeSessionIndex', nextIndex.toString());
            toast.info('Logged out. Switching session...');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
    };

    // Update active user data (e.g., stars, profile info)
    const updateUser = (data) => {
        if (!user) return;

        const activeIndex = localStorage.getItem('activeSessionIndex');
        const index = parseInt(activeIndex) || 0;

        const newSessions = [...sessions];
        if (newSessions[index]) {
            newSessions[index] = { ...newSessions[index], ...data };
            updateSessions(newSessions, index);
        }
    };

    // Fetch latest user data from backend and update session
    const refreshUser = async () => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get(`${API_BASE_URL}/api/users/${user._id}`, config);
            if (res.data) {
                // Keep the current token as the GET user endpoint might not return it
                updateUser({ ...res.data, token: user.token });
            }
        } catch (error) {
            console.error('Error refreshing user:', error);
        }
    };

    // Batch login for test accounts
    const seedSessions = async () => {
        const testAccounts = ['admin', 'a', 'b', 'c', 'd'];
        let newSessions = [...sessions];
        let hasChanges = false;
        let targetIndexToSwitchTo = -1;

        toast.info('Seeding test accounts...', { autoClose: 2000 });

        for (const account of testAccounts) {
            try {
                // Determine correct password
                const pwd = account === 'admin' ? 'admin123' : account;

                // Make login request using 'account' as email and correct password
                const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                    email: account,
                    password: pwd
                });

                if (res.data) {
                    const existingIndex = newSessions.findIndex(s => s._id === res.data._id);
                    if (existingIndex !== -1) {
                        newSessions[existingIndex] = res.data;
                    } else {
                        newSessions.push(res.data);
                    }
                    
                    if (account === 'admin') {
                        targetIndexToSwitchTo = newSessions.findIndex(s => s.username === 'admin');
                        // TRIGGER BACKEND SEEDING AFTER ADMIN LOGIN
                        try {
                            const config = { headers: { Authorization: `Bearer ${res.data.token}` } };
                            await axios.post(`${API_BASE_URL}/api/admin/seed`, {}, config);
                            console.log('Backend database seeded successfully during session initialization.');
                        } catch (seedErr) {
                            console.error('Failed to trigger backend seeding:', seedErr.response?.data?.message || seedErr.message);
                        }
                    }
                    hasChanges = true;
                }
            } catch (error) {
                console.error(`Failed to seed account ${account}:`, error.response?.data?.message || error.message);
            }
        }

        if (hasChanges) {
            // Update storage without setting user state (reload will handle it)
            localStorage.setItem('sessions', JSON.stringify(newSessions));
            if (targetIndexToSwitchTo !== -1) {
                localStorage.setItem('activeSessionIndex', targetIndexToSwitchTo.toString());
            }
            
            toast.success('Test accounts seeded successfully. Reloading...');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } else {
            toast.info('Test accounts already seeded');
            // Check if we need to switch to 'a' anyway
            const currentIndex = parseInt(localStorage.getItem('activeSessionIndex')) || 0;
            if (targetIndexToSwitchTo !== -1 && targetIndexToSwitchTo !== currentIndex) {
                localStorage.setItem('activeSessionIndex', targetIndexToSwitchTo.toString());
                toast.info('Switching to account A...');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            }
        }
    };

    // Trigger seed from URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('seed') === 'true') {
            seedSessions();
            // Clean up URL
            const url = new URL(window.location);
            url.searchParams.delete('seed');
            window.history.replaceState({}, '', url);
        }
    }, [sessions]);

    return (
        <AuthContext.Provider value={{ user, sessions, register, login, logout, switchSession, updateUser, refreshUser, seedSessions, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

