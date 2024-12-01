import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const EditOrganisationPage = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contactEmail: '',
    phoneNumber: '',
    website: '',
    incorporationId: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrganisationDetails = async () => {
      try {
        const { data } = await API.get(`/organisations/${orgId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFormData({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          contactEmail: data.contactEmail || '',
          phoneNumber: data.phoneNumber || '',
          website: data.website || '',
          incorporationId: data.incorporationId || '',
        });
      } catch (err) {
        console.error('Failed to fetch organisation details:', err);
      }
    };

    fetchOrganisationDetails();
  }, [orgId]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      await API.put(
        `/organisations/${orgId}/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Organisation updated successfully');
      navigate(`/organisation/${orgId}`);
    } catch (err) {
      console.error('Failed to update organisation:', err);
      setError('Failed to update organisation. Please try again.');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Organisation</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSaveChanges} className="space-y-6 bg-white p-6 shadow-lg rounded-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Organisation Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border rounded-lg"
          ></textarea>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="incorporationId" className="block text-sm font-medium text-gray-700">
            Incorporation ID
          </label>
          <input
            id="incorporationId"
            type="text"
            value={formData.incorporationId}
            onChange={(e) => setFormData({ ...formData, incorporationId: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditOrganisationPage;
