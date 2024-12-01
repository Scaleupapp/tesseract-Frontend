import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const componentMapping = {
  budget: 'Budget Management',
  taskManagement: 'Task Management',
  documentation: 'Documentation Management',
};

const ManageMembersAndComponents = () => {
  const { orgId } = useParams();
  const [members, setMembers] = useState([]);
  const [enabledComponents, setEnabledComponents] = useState({});
  const [localRoleChanges, setLocalRoleChanges] = useState({});
  const [localComponentChanges, setLocalComponentChanges] = useState({});
  const [orgLevelComponents, setOrgLevelComponents] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/organisations/${orgId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMembers(data.members || []);
        setEnabledComponents(data.servicesEnabled || {});
        setOrgLevelComponents(data.servicesEnabled || {});
      } catch (err) {
        console.error('Error fetching organisation data:', err);
      }
    };

    fetchData();
  }, [orgId]);

  const toggleOrgLevelComponent = (component) => {
    setOrgLevelComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  const toggleUserComponent = (userId, component) => {
    setLocalComponentChanges((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [component]: !prev[userId]?.[component] || false,
      },
    }));
  };

  const handleRoleChange = (userId, newRole) => {
    setLocalRoleChanges((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await API.post(
        `/organisations/remove-member`,
        { orgId, userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMembers((prev) => prev.filter((member) => member.userId._id !== userId));
      alert('User removed successfully!');
    } catch (err) {
      console.error('Error removing user:', err);
      alert('Failed to remove user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      // Prepare user updates
      const userChanges = Object.keys(localRoleChanges).map((userId) => ({
        userId,
        role: localRoleChanges[userId],
      }));

      const userAssignments = {};
      Object.keys(localComponentChanges).forEach((userId) => {
        userAssignments[userId] = localComponentChanges[userId];
      });

      // Update user access
      await API.put(
        `/organisations/edit-user-access`,
        { orgId, userChanges, userAssignments },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      // Fetch the updated data to reflect changes
      const { data } = await API.get(`/organisations/${orgId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMembers(data.members || []);
      setEnabledComponents(data.servicesEnabled || {});
      setOrgLevelComponents(data.servicesEnabled || {});

      alert('Changes saved successfully!');
      setLocalRoleChanges({});
      setLocalComponentChanges({});
    } catch (err) {
      console.error('Error saving changes:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Saving...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Manage Members & Components</h1>

      {/* Top-Level Components */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Organisation Components</h2>
        <div className="grid grid-cols-3 gap-4">
          {Object.keys(componentMapping).map((component) => (
            <label key={component} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={orgLevelComponents[component] || false}
                onChange={() => toggleOrgLevelComponent(component)}
              />
              <span>{componentMapping[component]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300 text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Role</th>
              {Object.keys(componentMapping).map((component) => (
                <th key={component} className="border border-gray-300 p-2 text-left">
                  {componentMapping[component]}
                </th>
              ))}
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.userId._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  {member.userId.firstName} {member.userId.lastName}
                </td>
                <td className="border border-gray-300 p-2">
                  <select
                    className="p-1 border border-gray-300 rounded"
                    value={localRoleChanges[member.userId._id] || member.role}
                    onChange={(e) => handleRoleChange(member.userId._id, e.target.value)}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                  </select>
                </td>
                {Object.keys(componentMapping).map((component) => (
                  <td key={component} className="border border-gray-300 p-2 text-center">
                    <input
                      type="checkbox"
                      checked={
                        localComponentChanges[member.userId._id]?.[component] ??
                        member.servicesAccess[component]
                      }
                      onChange={() => toggleUserComponent(member.userId._id, component)}
                      disabled={!orgLevelComponents[component]}
                    />
                  </td>
                ))}
                <td className="border border-gray-300 p-2 text-center">
                  <button
                    onClick={() => handleDeleteUser(member.userId._id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={saveChanges}
        className="mt-6 w-full bg-blue-600 text-white font-medium py-2 rounded shadow hover:bg-blue-700 transition duration-300"
        disabled={
          Object.keys(localRoleChanges).length === 0 && Object.keys(localComponentChanges).length === 0
        }
      >
        Save Changes
      </button>
    </div>
  );
};

export default ManageMembersAndComponents;
