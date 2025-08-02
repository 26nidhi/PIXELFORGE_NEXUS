import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext"; // <-- Add this
import ProjectCard from "../components/ProjectCard";
import AddProjectModal from "../components/AddProjectModal";
import AssignDevelopersModal from "../components/AssignDevelopersModal";
import Spinner from "../components/Spinner";
import API from "../api";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // NEW
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [assignModalData, setAssignModalData] = useState({
    open: false,
    projectId: null,
  });
  const [confirmData, setConfirmData] = useState({
    open: false,
    projectId: null,
    type: "",
  }); // type: "complete" or "delete"

  const fetchProjects = async () => {
    try {
      setLoading(true);
      if (user.role === "Admin") {
        const { data } = await API.get("/projects");
        setProjects(data);
      } else {
        const { data } = await API.get("/projects/my-projects");
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user.role]);

  const handleConfirmAction = async () => {
    try {
      if (confirmData.type === "complete") {
        await API.put(`/projects/${confirmData.projectId}/complete`);
        toast.success("Project marked as completed!");
      } else if (confirmData.type === "delete") {
        await API.delete(`/projects/${confirmData.projectId}`);
        toast.success("Project deleted successfully!");
      }
      setConfirmData({ open: false, projectId: null, type: "" });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const activeProjects = projects.filter((p) => p.status === "Active");
  const completedProjects = projects.filter((p) => p.status === "Completed");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard ({user.role})</h1>

      {user.role === "Admin" && (
        <div className="mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setAddModalOpen(true)}
          >
            Add Project
          </button>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Active Projects */}
          <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
          {activeProjects.length === 0 && (
            <p className="text-gray-500 mb-6">No active projects</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {activeProjects.map((project) => (
              <div key={project._id} className="relative">
                <ProjectCard project={project} />

                {/* Admin: Mark Completed & Delete */}
                {user.role === "Admin" && (
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        setConfirmData({
                          open: true,
                          projectId: project._id,
                          type: "complete",
                        })
                      }
                    >
                      Mark Completed
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        setConfirmData({
                          open: true,
                          projectId: project._id,
                          type: "delete",
                        })
                      }
                    >
                      Delete
                    </button>
                  </div>
                )}

                {/* Project Lead: Assign Developers */}
                {user.role === "Project Lead" && (
                  <button
                    className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      setAssignModalData({ open: true, projectId: project._id })
                    }
                  >
                    Assign Developers
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Completed Projects */}
          <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
          {completedProjects.length === 0 && (
            <p className="text-gray-500">No completed projects</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedProjects.map((project) => (
              <div key={project._id} className="relative">
                <ProjectCard project={project} />

                {/* Admin: Delete Completed Project */}
                {user.role === "Admin" && (
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() =>
                      setConfirmData({
                        open: true,
                        projectId: project._id,
                        type: "delete",
                      })
                    }
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onProjectAdded={fetchProjects}
      />

      {/* Assign Developers Modal */}
      <AssignDevelopersModal
        isOpen={assignModalData.open}
        projectId={assignModalData.projectId}
        onClose={() => setAssignModalData({ open: false, projectId: null })}
        onAssigned={fetchProjects}
      />

      {/* Confirmation Dialog */}
      {confirmData.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
            <p className="mb-6">
              {confirmData.type === "complete"
                ? "Are you sure you want to mark this project as completed?"
                : "Are you sure you want to delete this project? This cannot be undone."}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  setConfirmData({ open: false, projectId: null, type: "" })
                }
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded ${
                  confirmData.type === "delete"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {confirmData.type === "delete"
                  ? "Yes, Delete"
                  : "Yes, Complete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
