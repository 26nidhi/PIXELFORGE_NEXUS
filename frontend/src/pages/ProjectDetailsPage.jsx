// import { useParams } from "react-router-dom";
// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import DocumentList from "../components/DocumentList";
// import API from "../api";

// export default function ProjectDetailsPage() {
//   const { id } = useParams();
//   const { user } = useContext(AuthContext);
//   const [project, setProject] = useState(null);
//   const [documents, setDocuments] = useState([]);
//   const [file, setFile] = useState(null);

//   // Fetch project details & documents
//  useEffect(() => {
//    const fetchData = async () => {
//      try {
//        const { data: projectDocs } = await API.get(`/documents/${id}`);
//        setDocuments(projectDocs); // Full doc objects

//        const { data: userProjects } = await API.get("/projects/my-projects");
//        const selectedProject = userProjects.find((p) => p._id === id);
//        setProject(selectedProject);
//      } catch (err) {
//        console.error(err);
//      }
//    };
//    fetchData();
//  }, [id]);

//  const handleUpload = async (e) => {
//    e.preventDefault();
//    const formData = new FormData();
//    formData.append("file", file);

//    try {
//      await API.post(`/documents/${id}/upload`, formData, {
//        headers: { "Content-Type": "multipart/form-data" },
//      });
//      alert("Document uploaded");
//      setFile(null);

//      // Refresh documents
//      const { data: updatedDocs } = await API.get(`/documents/${id}`);
//      setDocuments(updatedDocs);
//    } catch (err) {
//      alert(err.response?.data?.message || "Upload failed");
//    }
//  };

//  if (!project) return <p className="p-6">Loading project...</p>;

//  return (
//    <div className="p-6">
//      <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
//      <p className="text-gray-600 mb-4">{project.description}</p>
//      <p className="text-sm text-gray-500 mb-6">Deadline: {project.deadline}</p>

//      <h2 className="text-xl font-semibold mb-2">Project Documents:</h2>
//      <DocumentList documents={documents} />

//      {(user.role === "Admin" || user.role === "Project Lead") && (
//        <form onSubmit={handleUpload} className="mt-4">
//          <input
//            type="file"
//            onChange={(e) => setFile(e.target.files[0])}
//            className="mb-3"
//          />
//          <button
//            type="submit"
//            className="bg-green-500 text-white px-4 py-2 rounded"
//          >
//            Upload Document
//          </button>
//        </form>
//      )}
//    </div>
//  );
// }

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
  const [isUploading, setIsUploading] = useState(false);

  // Fetch project details & documents
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: projectDocs } = await API.get(`/documents/${id}`);
        setDocuments(projectDocs); // Full doc objects

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
    if (!file) return;

    setIsUploading(true);
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
    } finally {
      setIsUploading(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
        {/* Project Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                    {project.name}
                  </h1>
                  <div className="flex items-center mt-2 space-x-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        project.status === "Completed"
                          ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200"
                          : "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          project.status === "Completed"
                            ? "bg-emerald-400"
                            : "bg-amber-400"
                        } ${
                          project.status === "Active" ? "animate-pulse" : ""
                        }`}
                      ></div>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex items-center space-x-6">
                <div className="flex items-center text-slate-600">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-medium">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Project Documents
                </h2>
              </div>

              <DocumentList documents={documents} />
            </div>
          </div>

          {/* Upload Section */}
          {(user.role === "Admin" || user.role === "Project Lead") && (
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center mr-4">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Upload Document
                  </h3>
                </div>

                <form onSubmit={handleUpload} className="space-y-6">
                  {/* File Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Select File
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200"
                      >
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <div className="mt-4">
                            <p className="text-sm text-slate-600">
                              <span className="font-semibold text-blue-600">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              PDF, PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {file && (
                      <div className="mt-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-blue-500 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm text-slate-700 font-medium">
                            {file.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <button
                    type="submit"
                    disabled={!file || isUploading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {isUploading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <span>Upload Document</span>
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
