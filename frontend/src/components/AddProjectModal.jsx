import { useState, useEffect } from "react";
import API from "../api";

export default function AddProjectModal({ isOpen, onClose, onProjectAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [leadId, setLeadId] = useState("");
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { data } = await API.get("/auth/leads"); // API to fetch Project Leads
        setLeads(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) fetchLeads();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects", { name, description, deadline, leadId });
      alert("Project created!");
      onProjectAdded(); // Refresh dashboard
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add project");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 mb-3 w-full rounded"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 mb-3 w-full rounded"
            required
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border p-2 mb-3 w-full rounded"
            required
          />
          <select
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="border p-2 mb-4 w-full rounded"
            required
          >
            <option value="">Select Project Lead</option>
            {leads.map((lead) => (
              <option key={lead._id} value={lead._id}>
                {lead.name}
              </option>
            ))}
          </select>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
