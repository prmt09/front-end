import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); // Use navigate for redirection

    const login = (username, password, role) => {
        // Simulated authentication - replace with actual API call
        if ((username === 'admin' && password === 'password' && role === 'admin') ||
            (username === 'user' && password === 'userPassword' && role === 'user')) {
            setUser({ username, role });
            navigate('/patients'); // Redirect to the patients list upon successful login
        } else {
            alert('Invalid credentials');
        }
    };

    const logout = () => {
        setUser(null);
        navigate('/'); // Redirect to the login page upon logout
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
