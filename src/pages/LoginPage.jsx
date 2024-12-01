import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/users/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Tesseract</h1>
          <p className="text-gray-500 text-sm mb-6">
            Tesseract is your ultimate productivity platform, empowering teams to collaborate,
            manage tasks, and innovate together. Sign in to get started!
          </p>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New to Tesseract?{' '}
            <span
              className="text-blue-600 font-medium cursor-pointer hover:underline"
              onClick={() => navigate('/register')}
            >
              Register here
            </span>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            By logging in, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <footer className="mt-8 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Tesseract. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;
