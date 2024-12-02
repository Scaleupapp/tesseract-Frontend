import React from "react";

const BudgetOverview = ({ orgId }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Budget Overview</h2>
      <p>
        This is the Budget Overview page for Organisation ID: <strong>{orgId}</strong>.
      </p>
      {/* Add components like charts, analytics, and budget summaries here */}
    </div>
  );
};

export default BudgetOverview;
