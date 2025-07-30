import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import API from "../api";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
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
    fetchProjects();
  }, [user.role]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
