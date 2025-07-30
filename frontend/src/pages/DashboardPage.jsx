import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  if (!user) return <p className="text-center mt-10">Unauthorized</p>;

  // Mock project data
  const projects = [
    {
      id: "1",
      name: "Space Adventure",
      description: "A 3D space exploration game.",
      deadline: "2025-12-31",
      status: "Active",
    },
    {
      id: "2",
      name: "Pixel Quest",
      description: "Retro RPG with pixel graphics.",
      deadline: "2025-10-15",
      status: "Completed",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard ({user.role})</h1>

      {user.role === "Admin" && (
        <div className="mb-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Add Project
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded">
            Manage Users
          </button>
        </div>
      )}

      {user.role === "Project Lead" && (
        <div className="mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Assign Developers
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Upload Documents
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
