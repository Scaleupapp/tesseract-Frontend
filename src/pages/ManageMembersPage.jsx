import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const ManageMembersPage = () => {
  const { orgId } = useParams();
  const [members, setMembers] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await API.get(`/organisations/${orgId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMembers(data.members || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMembers();
  }, [orgId]);

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    try {
      await API.put(
        '/organisations/edit-user-access',
        { orgId, userId, updates: { role: newRole } },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMembers((prev) =>
        prev.map((member) =>
          member.userId._id === userId ? { ...member, role: newRole } : member
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await API.post(
        '/organisations/remove-member',
        { orgId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMembers((prev) => prev.filter((member) => member.userId._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Members</h1>
      {members.map((member) => (
        <div key={member.userId._id} className="p-4 border rounded mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p>{member.userId.firstName} {member.userId.lastName}</p>
              <p>{member.role}</p>
            </div>
            <div>
              <select
                value={selectedRole[member.userId._id] || member.role}
                onChange={(e) => setSelectedRole({ ...selectedRole, [member.userId._id]: e.target.value })}
                className="p-2 border rounded"
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
              </select>
              <button
                onClick={() => handleRoleChange(member.userId._id, selectedRole[member.userId._id] || member.role)}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update Role
              </button>
              <button
                onClick={() => handleRemoveMember(member.userId._id)}
                className="ml-4 bg-red-600 text-white px-4 py-2 rounded"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageMembersPage;
