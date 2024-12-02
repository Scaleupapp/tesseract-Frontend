import React, { useState, useEffect } from "react";
import WorkflowDesigner from "./WorkflowDesigner";
import API from "../utils/api";

const BudgetWorkflowDesigner = ({ orgId }) => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch existing workflows for the organisation
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/workflows", {
          params: { organisationId: orgId, component: "Budget" },
        });
        setWorkflows(data);
      } catch (error) {
        console.error("Error fetching workflows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [orgId]);

  const handleSaveWorkflow = async (newWorkflow) => {
    try {
      const { data } = await API.post("/workflows/create", {
        organisationId: orgId,
        component: "Budget",
        workflow: newWorkflow,
      });
      setWorkflows((prev) => [...prev, data]);
      alert("Workflow saved successfully!");
    } catch (error) {
      console.error("Error saving workflow:", error);
      alert("Failed to save workflow.");
    }
  };

  const handleUpdateWorkflow = async (workflowId, updatedWorkflow) => {
    try {
      const { data } = await API.put(`/workflows/${workflowId}`, updatedWorkflow);
      setWorkflows((prev) =>
        prev.map((workflow) => (workflow._id === workflowId ? data : workflow))
      );
      alert("Workflow updated successfully!");
    } catch (error) {
      console.error("Error updating workflow:", error);
      alert("Failed to update workflow.");
    }
  };

  const handleDeleteWorkflow = async (workflowId) => {
    try {
      await API.delete(`/workflows/${workflowId}`);
      setWorkflows((prev) => prev.filter((workflow) => workflow._id !== workflowId));
      alert("Workflow deleted successfully!");
    } catch (error) {
      console.error("Error deleting workflow:", error);
      alert("Failed to delete workflow.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Budget Workflow Designer
      </h1>
      {loading ? (
        <div className="text-center">Loading workflows...</div>
      ) : (
        <WorkflowDesigner
          workflows={workflows}
          onSaveWorkflow={handleSaveWorkflow}
          onUpdateWorkflow={handleUpdateWorkflow}
          onDeleteWorkflow={handleDeleteWorkflow}
          component="Budget"
        />
      )}
    </div>
  );
};

export default BudgetWorkflowDesigner;
