import React from "react";

const ExpensePage = ({ orgId }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expenses</h2>
      <p>
        Manage expenses for Organisation ID: <strong>{orgId}</strong>.
      </p>
      {/* Add forms, lists, or analytics for expenses here */}
    </div>
  );
};

export default ExpensePage;
