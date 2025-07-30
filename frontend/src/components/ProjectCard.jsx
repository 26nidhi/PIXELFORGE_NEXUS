import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{project.name}</h3>
      <p className="text-gray-600 mb-2">{project.description}</p>
      <p className="text-sm text-gray-500 mb-2">Deadline: {project.deadline}</p>
      <p
        className={`text-sm font-semibold ${
          project.status === "Completed" ? "text-green-600" : "text-yellow-600"
        }`}
      >
        {project.status}
      </p>
      <Link
        to={`/project/${project.id}`}
        className="block mt-3 bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600"
      >
        View Details
      </Link>
    </div>
  );
}
