import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const CreateOrganisationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    incorporationId: '',
    description: '',
    address: '',
    phoneNumber: '',
    contactEmail: '',
    website: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateOrganisation = async (e) => {
    e.preventDefault();
    try {
      await API.post('/organisations/create', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organisation');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md text-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold mb-4 text-indigo-600">
            Build Your Organisation
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            Create a space to collaborate, manage, and grow your team effortlessly.
          </p>
        </div>

        {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4 text-sm">{error}</p>}

        <form onSubmit={handleCreateOrganisation} className="space-y-3">
          <input
            type="text"
            placeholder="Organisation Name"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Incorporation ID"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.incorporationId}
            onChange={(e) => setFormData({ ...formData, incorporationId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          />
          <input
            type="email"
            placeholder="Contact Email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
          />
          <input
            type="text"
            placeholder="Website"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded shadow hover:bg-indigo-700 transition duration-300"
          >
            Create Organisation
          </button>
        </form>

        <footer className="mt-4 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Tesseract. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default CreateOrganisationPage;
