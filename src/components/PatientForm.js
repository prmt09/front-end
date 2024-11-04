import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PatientForm = ({ patient, onSubmit, onCancel, fetchPatients }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const { user } = useAuth();

    // Populate the form with patient data if editing
    useEffect(() => {
        if (patient) {
            setFirstName(patient.firstName);
            setLastName(patient.lastName);
            setEmail(patient.email);
            setDateOfBirth(patient.dateOfBirth);
            setPhoneNumber(patient.phoneNumber);
            setAddress(patient.patientAddress);
        }
    }, [patient]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPatient = {
            firstName,
            lastName,
            email,
            dateOfBirth,
            phoneNumber,
            patientAddress: address,
        };

        try {
            let response;
            // Check if patient exists and has a valid ID
            if (patient && patient.id) {
                // Update existing patient
                response = await axios.put(`http://localhost:8080/api/patients/${patient.id}`, newPatient);
            } else {
                // Create new patient
                response = await axios.post('http://localhost:8080/api/patients', newPatient);
            }

            console.log('Patient saved successfully:', response.data);
            fetchPatients(); // Refresh the patient list
            onSubmit(response.data); // Call onSubmit with the response data
            onCancel(); // Optionally close the form or redirect
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                    type="date"
                    className="form-control"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                    type="text"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-primary">Save</button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default PatientForm;
