import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PatientForm from './PatientForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [editingPatient, setEditingPatient] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            await fetchPatients();
        })();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error.response ? error.response.data : error.message);
        }
    };

    const handleCreateOrUpdate = async (patient) => {
        try {
            if (editingPatient) {
                // Update existing patient
                await axios.put(`http://localhost:8080/api/patients/${editingPatient.id}`, patient);
            } else {
                // Create new patient
                await axios.post('http://localhost:8080/api/patients', patient);
            }
            await fetchPatients();
            setEditingPatient(null);
        } catch (error) {
            console.error('Error saving patient:', error.response ? error.response.data : error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/patients/${id}`);
            await fetchPatients();
        } catch (error) {
            console.error('Error deleting patient:', error.response ? error.response.data : error.message);
        }
    };

    const handleLogout = () => {
        logout(); // Clear user data in context
        navigate('/'); // Redirect to the home page (which is the login page)
    };

    return (
        <div>
            <h2>Patients List</h2>
            {user && <p>Welcome, {user.username}!</p>} {/* Display the username */}
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            {user && user.role === 'admin' && (
                <button className="btn btn-primary" onClick={() => setEditingPatient({})}>Add Patient</button>
            )}
            <table className="table mt-3">
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>DOB</th>
                    <th>Address</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {patients.map((patient) => (
                    <tr key={patient.id}>
                        <td>{patient.firstName}</td>
                        <td>{patient.lastName}</td>
                        <td>{patient.email}</td>
                        <td>{patient.dateOfBirth}</td>
                        <td>{patient.patientAddress}</td>
                        <td>
                            {user && user.role === 'admin' && (
                                <>
                                    <button className="btn btn-warning" onClick={() => setEditingPatient(patient)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(patient.id)}>Delete</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {editingPatient && (
                <PatientForm
                    patient={editingPatient}
                    onSubmit={handleCreateOrUpdate}
                    onCancel={() => setEditingPatient(null)}
                    fetchPatients={fetchPatients}
                />
            )}
        </div>
    );
};

export default PatientsList;
