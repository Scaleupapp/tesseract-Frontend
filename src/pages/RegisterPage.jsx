import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    location: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 text-white px-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-gray-800">
        <h1 className="text-xl font-bold mb-3 text-center text-blue-600">Join Tesseract</h1>
        <p className="text-xs text-gray-500 text-center mb-4">
          Sign up to streamline your work and achieve your goals faster!
        </p>

        {error && <p className="text-red-500 bg-red-100 p-2 rounded text-xs mb-3">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <input
            id="dateOfBirth"
            type="date"
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
          <input
            id="location"
            type="text"
            placeholder="Location"
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <input
            id="phoneNumber"
            type="text"
            placeholder="Phone Number"
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 rounded text-sm hover:bg-blue-700 focus:outline-none"
          >
            Register
          </button>
        </form>

        <p className="text-xs text-gray-600 text-center mt-3">
          Already have an account?{' '}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
        <footer className="text-center text-gray-500 text-xs mt-3">
          &copy; {new Date().getFullYear()} Tesseract. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;
