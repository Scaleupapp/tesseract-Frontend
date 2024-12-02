import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const WorkflowDesigner = ({ workflows, onSaveWorkflow, component }) => {
  const [newWorkflow, setNewWorkflow] = useState([
    { id: "step-1", name: "Step 1", actions: ["Action 1"] },
  ]);

  const handleAddStep = () => {
    const newStep = {
      id: `step-${newWorkflow.length + 1}`,
      name: `Step ${newWorkflow.length + 1}`,
      actions: [],
    };
    setNewWorkflow((prev) => [...prev, newStep]);
  };

  const handleAddAction = (stepId) => {
    setNewWorkflow((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? {
              ...step,
              actions: [...step.actions, `Action ${step.actions.length + 1}`],
            }
          : step
      )
    );
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedWorkflow = Array.from(newWorkflow);
    const [removed] = reorderedWorkflow.splice(result.source.index, 1);
    reorderedWorkflow.splice(result.destination.index, 0, removed);

    setNewWorkflow(reorderedWorkflow);
  };

  const handleSave = () => {
    onSaveWorkflow(newWorkflow);
    setNewWorkflow([]);
  };

  return (
    <div className="bg-white shadow-lg rounded p-6">
      <h2 className="text-xl font-semibold mb-4">{component} Workflow Designer</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="workflow">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {newWorkflow.map((step, index) => (
                <Draggable key={step.id} draggableId={step.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-4 p-4 border rounded bg-gray-100"
                    >
                      <h3 className="font-bold">{step.name}</h3>
                      <ul className="ml-4">
                        {step.actions.map((action, idx) => (
                          <li key={idx} className="text-sm">
                            {action}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleAddAction(step.id)}
                        className="mt-2 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                      >
                        Add Action
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleAddStep}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Step
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Save Workflow
        </button>
      </div>
    </div>
  );
};

export default WorkflowDesigner;
