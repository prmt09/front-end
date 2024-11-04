import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PatientsList from './PatientsList';
import Login from './Login'; // Import the Login component
import { useAuth } from '../context/AuthContext';

const AppRoute = () => {
    const { user } = useAuth(); // Access the user state from AuthContext

    return (
        <Routes>
            <Route path="/" element={user ? <PatientsList /> : <Login />} />
            <Route path="/patients" element={user ? <PatientsList /> : <Login />} />
            {/* You can add more routes here as needed */}
        </Routes>
    );
};

export default AppRoute;
