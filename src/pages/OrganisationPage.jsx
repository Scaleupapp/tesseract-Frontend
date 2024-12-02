import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const componentMapping = {
  budget: 'Budget Management',
  taskManagement: 'Task Management',
  documentation: 'Documentation Management',
};

const OrganisationPage = () => {
  const { orgId } = useParams();
  const [organisation, setOrganisation] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [enabledComponents, setEnabledComponents] = useState({});
  const [userAssignments, setUserAssignments] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganisationDetails = async () => {
        try {
          const { data } = await API.get(`/organisations/${orgId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setOrganisation(data);
  
          const currentUserId = JSON.parse(localStorage.getItem('user'))._id;
          const adminMember = data.members.find(
            (member) => member.userId._id === currentUserId && member.role === 'Admin'
          );
          setIsAdmin(!!adminMember);
  
          // Initialize enabled components and user assignments
          setEnabledComponents(data.servicesEnabled || {});
          const assignments = {};
          data.members.forEach((member) => {
            assignments[member.userId._id] = member.servicesAccess || {};
          });
          setUserAssignments(assignments);
        } catch (err) {
          console.error('Failed to fetch organisation details:', err);
        }
      };
  
      fetchOrganisationDetails();
    }, [orgId]);

    const renderServiceButtons = () => (
      <div className="flex flex-wrap gap-6 justify-center mt-8">
        {Object.keys(componentMapping).map((component) => (
          <div
            key={component}
            className="relative bg-white shadow-lg rounded-lg p-6 w-80 text-center"
          >
            <h3 className="text-lg font-bold mb-4">{componentMapping[component]}</h3>
            <button
              className={`py-3 px-6 text-lg font-semibold rounded transition-all duration-300 ${
                enabledComponents[component]
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() =>
                enabledComponents[component] && navigate(`/organisation/${orgId}/${component}/workflowDesigner`)
              }
              disabled={!enabledComponents[component]}
            >
              {enabledComponents[component] ? `Go to ${componentMapping[component]}` : "Not Active"}
            </button>
            {!enabledComponents[component] && (
              <p className="text-sm mt-2 text-red-500">
                This service is not active. Activate it from the admin panel.
              </p>
            )}
          </div>
        ))}
      </div>
    );
    
  

  const handleDeleteOrganisation = async () => {
    if (window.confirm('Are you sure you want to delete this organisation?')) {
      try {
        await API.post(
          '/organisations/delete',
          { orgId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        alert('Organisation deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete organisation:', err);
        alert('Error occurred while deleting the organisation.');
      }
    }
  };

  const toggleAccordion = (section) => {
    setOpenAccordion((prev) => (prev === section ? null : section));
  };

  


  const handleComponentToggle = (component) => {
    setEnabledComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  const handleUserAssignmentToggle = (userId, component) => {
    setUserAssignments((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [component]: !(prev[userId]?.[component] || false),
      },
    }));
  };

  const saveComponentSettings = async () => {
    try {
      await API.put(
        '/organisations/update-components',
        {
          orgId,
          components: enabledComponents,
          assignments: userAssignments,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Components updated successfully');
    } catch (err) {
      console.error('Error updating components:', err);
      alert('Failed to update components.');
    }
  };

  const renderDetailsTab = () => (
    <div className="rounded-lg shadow p-8 bg-white">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">{organisation.name}</h1>
      <p className="text-gray-700 mb-4">
        <strong>Description:</strong> {organisation.description}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Address:</strong> {organisation.address}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Contact Email:</strong> {organisation.contactEmail}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Phone Number:</strong> {organisation.phoneNumber}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Website:</strong>{' '}
        <a
          href={organisation.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {organisation.website}
        </a>
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Incorporation ID:</strong> {organisation.incorporationId}
      </p>

       {/* Render service buttons */}
       {renderServiceButtons()}
       
    </div>
  );

  const handleAccessRequest = async (userId, status) => {
    try {
      const role = 'Member'; // Define default role for approval; modify as needed
      await API.post(
        '/organisations/access-request',
        { orgId, userId, status, role },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      // Update the local state to reflect the changes
      setOrganisation((prevOrg) => ({
        ...prevOrg,
        accessRequests: prevOrg.accessRequests.filter((req) => req.userId._id !== userId),
      }));
      alert(`Request has been ${status.toLowerCase()}`);
    } catch (err) {
      console.error('Error processing access request:', err);
      alert('An error occurred while processing the request.');
    }
  };
  
  const renderAccessRequests = () => (
    <div className="rounded-lg shadow p-8 bg-white">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Access Requests</h2>
      {organisation.accessRequests && organisation.accessRequests.length > 0 ? (
        organisation.accessRequests.map((request) => (
          <div key={request._id} className="mb-6 p-4 border rounded shadow">
            <p className="text-gray-700 mb-2">
              <strong>Name:</strong> {request.userId.firstName} {request.userId.lastName}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> {request.userId.email}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleAccessRequest(request.userId._id, 'Approved')}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleAccessRequest(request.userId._id, 'Rejected')}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No pending access requests.</p>
      )}
    </div>
  );

  const renderAdminAccordion = () => (
    
    <div className="bg-white shadow rounded-lg">

          {/* User managemnt */}
          <div className="border-b">
        <button
          onClick={() => toggleAccordion('edit')}
          className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-semibold focus:outline-none"
        >
          Org Members & Components
          <span>{openAccordion === 'edit' ? '-' : '+'}</span>
        </button>
        {openAccordion === 'edit' && (
          <div className="p-4 bg-gray-50">
            <button
              onClick={() => navigate(`/organisation/${orgId}/manage-members-components`)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Manage Members & Components
            </button>
          </div>
        )}
      </div>

      
      {/* Edit Organisation */}
      <div className="border-b">
        <button
          onClick={() => toggleAccordion('edit')}
          className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-semibold focus:outline-none"
        >
          Edit Organisation
          <span>{openAccordion === 'edit' ? '-' : '+'}</span>
        </button>
        {openAccordion === 'edit' && (
          <div className="p-4 bg-gray-50">
            <button
              onClick={() => navigate(`/organisation/${orgId}/edit`)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Go to Edit Page
            </button>
          </div>
        )}
      </div>


      {/* View Access Requests */}
      <div className="border-b">
        <button
          onClick={() => toggleAccordion('accessRequests')}
          className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-semibold focus:outline-none"
        >
          View Access Requests
          <span>{openAccordion === 'accessRequests' ? '-' : '+'}</span>
        </button>
        {openAccordion === 'accessRequests' && (
          <div className="p-4 bg-gray-50">
            <p className="text-gray-700">Access requests are listed here.</p>
            <button
              onClick={() => setActiveTab('access-requests')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
            >
              View Access Requests
            </button>
          </div>
        )}
      </div>

      {/* View Billing Details */}
      <div className="border-b">
        <button
          onClick={() => toggleAccordion('billing')}
          className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-semibold focus:outline-none"
        >
          View Billing Details
          <span>{openAccordion === 'billing' ? '-' : '+'}</span>
        </button>
        {openAccordion === 'billing' && (
          <div className="p-4 bg-gray-50">
            <button
              onClick={() => navigate(`/organisation/${orgId}/billing`)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
            >
              View Billing Details
            </button>
          </div>
        )}
      </div>

      {/* Delete Organisation */}
      <div>
        <button
          onClick={() => toggleAccordion('delete')}
          className="w-full flex justify-between items-center p-4 text-left text-gray-800 font-semibold focus:outline-none"
        >
          Delete Organisation
          <span>{openAccordion === 'delete' ? '-' : '+'}</span>
        </button>
        {openAccordion === 'delete' && (
          <div className="p-4 bg-gray-50">
            <button
              onClick={handleDeleteOrganisation}
              className="bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-700 transition"
            >
              Delete Organisation
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (!organisation) return <div className="text-center text-gray-600">Loading...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("details")}
          className={`py-2 px-4 rounded ${
            activeTab === "details"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          Organisation Details
        </button>

        {isAdmin && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`py-2 px-4 rounded ${
              activeTab === "admin"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            Admin Panel
          </button>
        )}
        
      </div>
      

      {activeTab === "details" && renderDetailsTab()}
      {activeTab === "admin" && renderAdminAccordion()}
      {activeTab === "access-requests" && renderAccessRequests()}
    </div>
  );
};

export default OrganisationPage;
