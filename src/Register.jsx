// src/Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ onRegister }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                name,
                username,
                password,
            });
            if (response.status === 201) {
                alert('Registration successful! Please log in.');
                onRegister();
            }
        } catch (error) {
            alert('Registration failed. ' + error.response.data);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;
