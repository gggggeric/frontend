import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Auth.css';

// Yup validation schema
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

const Login = ({ setIsAuthenticated }) => {
    const [loading, setLoading] = useState(false); // State for loading
    const [showModal, setShowModal] = useState(false); // Modal state
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true); // Show loading spinner

        try {
            // Update URL to the deployed backend
            const response = await axios.post('https://pythonProject-Encryption-Backend.onrender.com/api/accounts/login/', {
                email: values.email,
                password: values.password,
            });

            // If login is successful
            setIsAuthenticated(true); // Update state to reflect successful authentication
            localStorage.setItem('isAuthenticated', 'true'); // Persist authentication status
            setLoading(false); // Hide loading spinner
            setShowModal(true); // Show success modal
            setTimeout(() => {
                navigate('/'); // Redirect to the home page or protected route after 2 seconds
            }, 2000);
        } catch (error) {
            setLoading(false); // Hide loading spinner
        }
    };

    return (
        <div className="auth-container">
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <h2>Login</h2>
                        <div className="input-container">
                            <Field
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="auth-input"
                            />
                            <ErrorMessage name="email" component="p" className="error-message" />
                        </div>
                        <div className="input-container">
                            <Field
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="auth-input"
                            />
                            <ErrorMessage name="password" component="p" className="error-message" />
                        </div>
                        <button type="submit" disabled={isSubmitting || loading}>Login</button>
                        {/* Show loading spinner when logging in */}
                        {loading && <div className="loading-spinner"></div>}
                    </Form>
                )}
            </Formik>

            {/* Modal for login success */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Login Successful!</h3>
                        <p>Welcome back!</p>
                        <button onClick={() => setShowModal(false)} className="modal-close-btn">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
