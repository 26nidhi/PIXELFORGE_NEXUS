import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProjectDetailsPage() {
  const { id } = useParams(); // Project ID from URL
  const { user } = useContext(AuthContext);

  // Placeholder data (replace with API later)
  const project = {
    id,
    name: "Space Adventure",
    description: "A 3D space exploration game.",
    deadline: "2025-12-31",
    team: ["Alice", "Bob"],
    documents: ["DesignDoc.pdf", "MeetingNotes.pdf"],
  };

  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (file) {
      alert(`File uploaded: ${file.name}`);
      setFile(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <p className="text-sm text-gray-500 mb-6">Deadline: {project.deadline}</p>

      <h2 className="text-xl font-semibold mb-2">Team Members:</h2>
      <ul className="list-disc pl-6 mb-6">
        {project.team.map((member, i) => (
          <li key={i}>{member}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Documents:</h2>
      <ul className="list-disc pl-6 mb-6">
        {project.documents.map((doc, i) => (
          <li key={i}>
            <a href="#" className="text-blue-500 underline">
              {doc}
            </a>
          </li>
        ))}
      </ul>

      {(user.role === "Admin" || user.role === "Project Lead") && (
        <form onSubmit={handleUpload}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-3"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Upload Document
          </button>
        </form>
      )}
    </div>
  );
}
