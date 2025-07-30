import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import AddProjectModal from "../components/AddProjectModal";
import AssignDevelopersModal from "../components/AssignDevelopersModal";
import API from "../api";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [assignModalData, setAssignModalData] = useState({
    open: false,
    projectId: null,
  });

  const fetchProjects = async () => {
    try {
      if (user.role === "Admin") {
        const { data } = await API.get("/projects");
        setProjects(data);
      } else {
        const { data } = await API.get("/projects/my-projects");
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user.role]);

  const handleAssignClick = (projectId) => {
    setAssignModalData({ open: true, projectId });
  };

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

      {user.role === "Project Lead" && (
        <p className="mb-4 text-gray-600">
          Select a project below and assign developers
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="relative">
            <ProjectCard project={project} />
            {user.role === "Project Lead" && (
              <button
                className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => handleAssignClick(project._id)}
              >
                Assign Developers
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onProjectAdded={fetchProjects}
      />

      <AssignDevelopersModal
        isOpen={assignModalData.open}
        projectId={assignModalData.projectId}
        onClose={() => setAssignModalData({ open: false, projectId: null })}
        onAssigned={fetchProjects}
      />
    </div>
  );
}
