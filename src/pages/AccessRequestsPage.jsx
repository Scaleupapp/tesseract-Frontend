import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const AccessRequestsPage = () => {
  const { orgId } = useParams();
  const [accessRequests, setAccessRequests] = useState([]);

  useEffect(() => {
    const fetchAccessRequests = async () => {
      try {
        const { data } = await API.get(`/organisations/${orgId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setAccessRequests(data.accessRequests || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAccessRequests();
  }, [orgId]);

  const handleRequest = async (userId, status) => {
    try {
      await API.post(
        '/organisations/access-request',
        { orgId, userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setAccessRequests((prev) => prev.filter((req) => req.userId._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Access Requests</h1>
      {accessRequests.map((request) => (
        <div key={request.userId._id} className="p-4 border rounded mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p>{request.userId.firstName} {request.userId.lastName}</p>
              <p>{request.userId.email}</p>
            </div>
            <div>
              <button
                onClick={() => handleRequest(request.userId._id, 'Approved')}
                className="bg-green-600 text-white px-4 py-2 rounded mr-4"
              >
                Approve
              </button>
              <button
                onClick={() => handleRequest(request.userId._id, 'Rejected')}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccessRequestsPage;
