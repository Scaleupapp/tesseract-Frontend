import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import BudgetOverview from "./BudgetOverview";
import RevenuePage from "./RevenuePage";
import ExpensePage from "./ExpensePage";

const BudgetSectionPage = () => {
  const { orgId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/organisation/${orgId}/budget/${tab}`);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-semibold text-blue-600 mb-6">Budget Management</h1>

      {/* Tabs for navigation */}
      <div className="flex gap-4 mb-6">
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "overview"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => handleTabChange("overview")}
        >
          Budget Overview
        </button>
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "revenue"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => handleTabChange("revenue")}
        >
          Revenue
        </button>
        <button
          className={`py-2 px-4 rounded ${
            activeTab === "expenses"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
          onClick={() => handleTabChange("expenses")}
        >
          Expenses
        </button>
      </div>

      {/* Routing for subpages */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <Routes>
          <Route
            path="overview"
            element={<BudgetOverview orgId={orgId} />}
          />
          <Route
            path="revenue"
            element={<RevenuePage orgId={orgId} />}
          />
          <Route
            path="expenses"
            element={<ExpensePage orgId={orgId} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default BudgetSectionPage;
