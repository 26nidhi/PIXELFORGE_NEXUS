import { useState, useEffect } from "react";
import API from "../api";

export default function AssignDevelopersModal({
  isOpen,
  onClose,
  projectId,
  onAssigned,
}) {
  const [developers, setDevelopers] = useState([]);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const { data } = await API.get("/auth/developers"); // API to fetch Developers
        setDevelopers(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) fetchDevelopers();
  }, [isOpen]);

  const toggleDeveloper = (id) => {
    setSelectedDevelopers((prev) =>
      prev.includes(id) ? prev.filter((devId) => devId !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    try {
      await API.put(`/projects/${projectId}/assign`, {
        developerIds: selectedDevelopers,
      });
      alert("Developers assigned!");
      onAssigned(); // Refresh project list
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign developers");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Assign Developers</h2>
        <div className="max-h-48 overflow-y-auto mb-4">
          {developers.map((dev) => (
            <label key={dev._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={dev._id}
                checked={selectedDevelopers.includes(dev._id)}
                onChange={() => toggleDeveloper(dev._id)}
                className="mr-2"
              />
              {dev.name} ({dev.email})
            </label>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
