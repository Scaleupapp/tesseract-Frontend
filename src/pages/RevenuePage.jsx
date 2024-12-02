import React, { useState, useEffect } from "react";
import API from "../utils/api";

const RevenuePage = ({ orgId }) => {
  const [revenues, setRevenues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    startDate: "",
    endDate: "",
  });
  const [analytics, setAnalytics] = useState(null);
  const [editRevenue, setEditRevenue] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchRevenues();
    fetchAnalytics();
  }, [filters, orgId]);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get(`/categories/${orgId}`);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchRevenues = async () => {
    try {
      const { data } = await API.get("/revenues", {
        params: { organisationId: orgId, ...filters },
      });
      setRevenues(data);
    } catch (error) {
      console.error("Error fetching revenues:", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get("/revenues/analytics", {
        params: { organisationId: orgId },
      });
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  const handleAddRevenue = async (revenue) => {
    try {
      const { data } = await API.post("/revenues/create", {
        ...revenue,
        organisationId: orgId,
      });
      setRevenues((prev) => [...prev, data.revenue]);
    } catch (error) {
      console.error("Error adding revenue:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const { data } = await API.post("/categories/manage", {
        organisationId: orgId,
        action: "add",
        category: { name: newCategory, subcategories: [] },
      });
      setCategories(data);
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddSubcategory = async () => {
    try {
      const { data } = await API.post("/categories/manage", {
        organisationId: orgId,
        action: "edit",
        category: selectedCategory,
        updates: {
          subcategories: [...categories.find(cat => cat.name === selectedCategory).subcategories, { name: newSubcategory }],
        },
      });
      setCategories(data);
      setNewSubcategory("");
    } catch (error) {
      console.error("Error adding subcategory:", error);
    }
  };

  const handleUpdateRevenue = async (revenueId, updates) => {
    try {
      const { data } = await API.put(`/revenues/${revenueId}`, updates);
      setRevenues((prev) =>
        prev.map((rev) => (rev._id === revenueId ? data.revenue : rev))
      );
    } catch (error) {
      console.error("Error updating revenue:", error);
    }
  };

  const handleMarkAsReceived = async (revenueId) => {
    try {
      const { data } = await API.post(`/revenues/mark-received`, { revenueId });
      setRevenues((prev) =>
        prev.map((rev) => (rev._id === revenueId ? data.revenue : rev))
      );
    } catch (error) {
      console.error("Error marking revenue as received:", error);
    }
  };

  const handleDeleteRevenue = async (revenueId) => {
    try {
      await API.delete(`/revenues/${revenueId}`);
      setRevenues((prev) => prev.filter((rev) => rev._id !== revenueId));
    } catch (error) {
      console.error("Error deleting revenue:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Revenue Management
      </h2>

      {/* Add Category/Subcategory */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Manage Categories and Subcategories
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Add New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Category
          </button>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Add Subcategory"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            className="p-2 border rounded"
          />
          <button
            onClick={handleAddSubcategory}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Subcategory
          </button>
        </div>
      </div>

      {/* Add Revenue */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Add Revenue
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const revenue = Object.fromEntries(formData.entries());
            handleAddRevenue(revenue);
            e.target.reset();
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              className="p-2 border rounded"
              required
            />
            <select name="category" className="p-2 border rounded" required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select name="subcategory" className="p-2 border rounded">
              <option value="">Select Subcategory</option>
              {categories
                .find((cat) => cat.name === filters.category)?.subcategories.map(
                  (sub) => (
                    <option key={sub.name} value={sub.name}>
                      {sub.name}
                    </option>
                  )
                )}
            </select>
            <input
              type="date"
              name="date"
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="source"
              placeholder="Source"
              className="p-2 border rounded"
            />
            <select name="recurringFrequency" className="p-2 border rounded">
              <option value="">Recurring Frequency</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <input
              type="text"
              name="commissionPercentage"
              placeholder="Commission % (Optional)"
              className="p-2 border rounded"
            />
            <button
              type="submit"
              className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add Revenue
            </button>
          </div>
        </form>
      </div>

      {/* Revenue List */}
      <div className="mb-6 p-4 bg-white shadow rounded">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Revenue List
        </h3>
        <ul>
          {revenues.map((rev) => (
            <li key={rev._id} className="mb-2 flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {rev.category} - {rev.subcategory}
                </p>
                <p className="text-gray-600">
                  Amount: {rev.amount} | Received:{" "}
                  {rev.isReceived ? "Yes" : "No"} | Date:{" "}
                  {new Date(rev.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600"
                  onClick={() => setEditRevenue(rev)}
                >
                  Edit
                </button>
                <button
                  className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                  onClick={() => handleMarkAsReceived(rev._id)}
                >
                  Mark as Received
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteRevenue(rev._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="mb-6 p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Revenue Analytics
          </h3>
          <p>
            <strong>Total Revenues:</strong> {analytics.totalRevenues}
          </p>
          <p>
            <strong>Total Received:</strong> {analytics.totalReceived}
          </p>
          <p>
            <strong>Outstanding:</strong> {analytics.outstanding}
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenuePage;
