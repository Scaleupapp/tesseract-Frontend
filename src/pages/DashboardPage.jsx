import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const DashboardPage = () => {
  const [organisations, setOrganisations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [requestedOrgs, setRequestedOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const { data } = await API.get('/users/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setOrganisations(data.organisations || []);
        setRequestedOrgs(data.accessRequests || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrganisations();
  }, []);

  const handleSearch = async () => {
    try {
      const { data } = await API.get(`/organisations/search?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSearchResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestAccess = async (orgId) => {
    try {
      await API.post(
        '/users/request-access',
        { orgId, userId: JSON.parse(localStorage.getItem('user'))._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Access request sent');
      setSearchResults((prevResults) =>
        prevResults.map((org) =>
          org._id === orgId ? { ...org, requested: true } : org
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectOrganisation = () => {
    if (selectedOrg) {
      navigate(`/organisation/${selectedOrg}`);
    } else {
      alert('Please select an organisation');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl text-gray-800">
        <h1 className="text-4xl font-bold mb-6 text-center text-indigo-600">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Manage your organisations, search for new ones, or create your own.
        </p>

        {organisations.length > 0 ? (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Select an Organisation
            </h2>
            <div className="flex flex-col items-center">
              <select
                className="w-full p-3 border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-500"
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
              >
                <option value="">-- Select Organisation --</option>
                {organisations.map((org) => (
                  <option key={org.orgId._id} value={org.orgId._id}>
                    {org.orgId.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSelectOrganisation}
                disabled={!selectedOrg}
                className={`mt-4 px-6 py-3 rounded-lg font-medium ${
                  selectedOrg
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                } transition duration-300`}
              >
                Go to Organisation
              </button>
            </div>
          </div>
        ) : (
          <p className="text-lg font-medium text-gray-600 mb-8 text-center">
            You are not part of any organisation yet. Create or search for one below!
          </p>
        )}

        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Search for Organisations
          </h2>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search for organisations..."
              className="w-full p-3 border border-gray-300 rounded-lg shadow focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Search
            </button>
          </div>
          <ul className="space-y-4 mt-6">
            {searchResults.map((org) => (
              <li
                key={org._id}
                className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow flex justify-between items-center"
              >
                <span className="text-lg font-medium text-gray-700">{org.name}</span>
                <button
                  onClick={() => handleRequestAccess(org._id)}
                  disabled={org.requested}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    org.requested
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } transition duration-300`}
                >
                  {org.requested ? 'Request Sent' : 'Request Access'}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {requestedOrgs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Requested Organisations
            </h2>
            <ul className="space-y-4">
              {requestedOrgs.map((org) => (
                <li
                  key={org.orgId._id}
                  className="p-4 bg-gray-50 border border-gray-300 rounded-lg shadow"
                >
                  <span className="text-lg font-medium text-gray-700">
                    {org.orgId.name} (Pending)
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={() => navigate('/create-organisation')}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition duration-300"
        >
          Create Organisation
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
