import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import DocumentList from "../components/DocumentList";
import API from "../api";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  // Fetch project details & documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectDocs } = await API.get(`/documents/${id}`);
        setDocuments(projectDocs);

        const { data: userProjects } = await API.get("/projects/my-projects");
        const selectedProject = userProjects.find((p) => p._id === id);
        setProject(selectedProject);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post(`/documents/${id}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Document uploaded");
      setFile(null);

      // Refresh documents
      const { data: updatedDocs } = await API.get(`/documents/${id}`);
      setDocuments(updatedDocs);
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed");
    }
  };

  if (!project) return <p className="p-6">Loading project...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <p className="text-sm text-gray-500 mb-6">Deadline: {project.deadline}</p>

      <h2 className="text-xl font-semibold mb-2">Project Documents:</h2>
      <DocumentList documents={documents.map((d) => d.filename)} />

      {(user.role === "Admin" || user.role === "Project Lead") && (
        <form onSubmit={handleUpload} className="mt-4">
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
