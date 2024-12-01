import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import CreateOrganisationPage from '../pages/CreateOrganisationPage';
import OrganisationPage from '../pages/OrganisationPage';
import ManageMembersPage from '../pages/ManageMembersPage';
import AccessRequestsPage from '../pages/AccessRequestsPage';
import BillingDetailsPage from '../pages/BillingDetailsPage';
import EditOrganisationPage from '../pages/EditOrganisationPage';
import ManageMembersAndComponents from '../pages/ManageMembersAndComponents';

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-organisation" element={<CreateOrganisationPage />} />
      <Route path="/organisation/:orgId" element={<OrganisationPage />} />
      <Route path="/organisation/:orgId/members" element={<ManageMembersPage />} />
      <Route path="/organisation/:orgId/access-requests" element={<AccessRequestsPage />} />
      <Route path="/organisation/:orgId/billing" element={<BillingDetailsPage />} />
      <Route path="/organisation/:orgId/edit" element={<EditOrganisationPage />} />
      <Route
        path="/organisation/:orgId/manage-members-components"
        element={<ManageMembersAndComponents />}
      />
    </Routes>
  </Router>
);

export default AppRoutes;
