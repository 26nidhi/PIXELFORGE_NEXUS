// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext"; // <-- Add this
// import ProjectCard from "../components/ProjectCard";
// import AddProjectModal from "../components/AddProjectModal";
// import AssignDevelopersModal from "../components/AssignDevelopersModal";
// import Spinner from "../components/Spinner";
// import API from "../api";
// import { toast } from "react-toastify";

// export default function DashboardPage() {
//   const { user } = useContext(AuthContext);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true); // NEW
//   const [isAddModalOpen, setAddModalOpen] = useState(false);
//   const [assignModalData, setAssignModalData] = useState({
//     open: false,
//     projectId: null,
//   });
//   const [confirmData, setConfirmData] = useState({
//     open: false,
//     projectId: null,
//     type: "",
//   }); // type: "complete" or "delete"

//   const fetchProjects = async () => {
//     try {
//       setLoading(true);
//       if (user.role === "Admin") {
//         const { data } = await API.get("/projects");
//         setProjects(data);
//       } else {
//         const { data } = await API.get("/projects/my-projects");
//         setProjects(data);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, [user.role]);

//   const handleConfirmAction = async () => {
//     try {
//       if (confirmData.type === "complete") {
//         await API.put(`/projects/${confirmData.projectId}/complete`);
//         toast.success("Project marked as completed!");
//       } else if (confirmData.type === "delete") {
//         await API.delete(`/projects/${confirmData.projectId}`);
//         toast.success("Project deleted successfully!");
//       }
//       setConfirmData({ open: false, projectId: null, type: "" });
//       fetchProjects();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Action failed");
//     }
//   };

//   const activeProjects = projects.filter((p) => p.status === "Active");
//   const completedProjects = projects.filter((p) => p.status === "Completed");

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Dashboard ({user.role})</h1>

//       {user.role === "Admin" && (
//         <div className="mb-4">
//           <button
//             className="bg-green-500 text-white px-4 py-2 rounded"
//             onClick={() => setAddModalOpen(true)}
//           >
//             Add Project
//           </button>
//         </div>
//       )}

//       {loading ? (
//         <Spinner />
//       ) : (
//         <>
//           {/* Active Projects */}
//           <h2 className="text-2xl font-semibold mb-4">Active Projects</h2>
//           {activeProjects.length === 0 && (
//             <p className="text-gray-500 mb-6">No active projects</p>
//           )}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             {activeProjects.map((project) => (
//               <div key={project._id} className="relative">
//                 <ProjectCard project={project} />

//                 {/* Admin: Mark Completed & Delete */}
//                 {user.role === "Admin" && (
//                   <div className="absolute top-2 right-2 flex space-x-2">
//                     <button
//                       className="bg-yellow-500 text-white px-3 py-1 rounded"
//                       onClick={() =>
//                         setConfirmData({
//                           open: true,
//                           projectId: project._id,
//                           type: "complete",
//                         })
//                       }
//                     >
//                       Mark Completed
//                     </button>
//                     <button
//                       className="bg-red-500 text-white px-3 py-1 rounded"
//                       onClick={() =>
//                         setConfirmData({
//                           open: true,
//                           projectId: project._id,
//                           type: "delete",
//                         })
//                       }
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}

//                 {/* Project Lead: Assign Developers */}
//                 {user.role === "Project Lead" && (
//                   <button
//                     className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded"
//                     onClick={() =>
//                       setAssignModalData({ open: true, projectId: project._id })
//                     }
//                   >
//                     Assign Developers
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Completed Projects */}
//           <h2 className="text-2xl font-semibold mb-4">Completed Projects</h2>
//           {completedProjects.length === 0 && (
//             <p className="text-gray-500">No completed projects</p>
//           )}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {completedProjects.map((project) => (
//               <div key={project._id} className="relative">
//                 <ProjectCard project={project} />

//                 {/* Admin: Delete Completed Project */}
//                 {user.role === "Admin" && (
//                   <button
//                     className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
//                     onClick={() =>
//                       setConfirmData({
//                         open: true,
//                         projectId: project._id,
//                         type: "delete",
//                       })
//                     }
//                   >
//                     Delete
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Add Project Modal */}
//       <AddProjectModal
//         isOpen={isAddModalOpen}
//         onClose={() => setAddModalOpen(false)}
//         onProjectAdded={fetchProjects}
//       />

//       {/* Assign Developers Modal */}
//       <AssignDevelopersModal
//         isOpen={assignModalData.open}
//         projectId={assignModalData.projectId}
//         onClose={() => setAssignModalData({ open: false, projectId: null })}
//         onAssigned={fetchProjects}
//       />

//       {/* Confirmation Dialog */}
//       {confirmData.open && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-6 w-96">
//             <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
//             <p className="mb-6">
//               {confirmData.type === "complete"
//                 ? "Are you sure you want to mark this project as completed?"
//                 : "Are you sure you want to delete this project? This cannot be undone."}
//             </p>
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={() =>
//                   setConfirmData({ open: false, projectId: null, type: "" })
//                 }
//                 className="px-3 py-1 border rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmAction}
//                 className={`px-4 py-2 rounded ${
//                   confirmData.type === "delete"
//                     ? "bg-red-500 text-white"
//                     : "bg-yellow-500 text-white"
//                 }`}
//               >
//                 {confirmData.type === "delete"
//                   ? "Yes, Delete"
//                   : "Yes, Complete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-700 border border-indigo-200">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2 animate-pulse"></div>
                  {user.role}
                </span>
              </div>
            </div>

            {user.role === "Admin" && (
              <button
                className="group relative bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => setAddModalOpen(true)}
              >
                <div className="flex items-center space-x-2">
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add Project</span>
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Total Projects
                  </p>
                  <p className="text-3xl font-bold text-slate-800">
                    {projects.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-600"
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
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Active Projects
                  </p>
                  <p className="text-3xl font-bold text-amber-600">
                    {activeProjects.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">
                    Completed
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {completedProjects.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Active Projects */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mr-3">
                  Active Projects
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
              </div>

              {activeProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-lg">No active projects</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeProjects.map((project) => (
                    <div key={project._id} className="relative group">
                      <ProjectCard project={project} />

                      {/* Admin: Mark Completed & Delete */}
                      {user.role === "Admin" && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                          <button
                            className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            onClick={() =>
                              setConfirmData({
                                open: true,
                                projectId: project._id,
                                type: "complete",
                              })
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            onClick={() =>
                              setConfirmData({
                                open: true,
                                projectId: project._id,
                                type: "delete",
                              })
                            }
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      )}

                      {/* Project Lead: Assign Developers */}
                      {user.role === "Project Lead" && (
                        <button
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-blue-400 to-indigo-400 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                          onClick={() =>
                            setAssignModalData({
                              open: true,
                              projectId: project._id,
                            })
                          }
                        >
                          <div className="flex items-center space-x-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            <span>Assign</span>
                          </div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed Projects */}
            <div>
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mr-3">
                  Completed Projects
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
              </div>

              {completedProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-lg">
                    No completed projects
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedProjects.map((project) => (
                    <div key={project._id} className="relative group">
                      <ProjectCard project={project} />

                      {/* Admin: Delete Completed Project */}
                      {user.role === "Admin" && (
                        <button
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                          onClick={() =>
                            setConfirmData({
                              open: true,
                              projectId: project._id,
                              type: "delete",
                            })
                          }
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  confirmData.type === "delete"
                    ? "bg-gradient-to-r from-rose-100 to-pink-100"
                    : "bg-gradient-to-r from-amber-100 to-orange-100"
                }`}
              >
                <svg
                  className={`w-8 h-8 ${
                    confirmData.type === "delete"
                      ? "text-rose-500"
                      : "text-amber-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {confirmData.type === "delete" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  )}
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Confirm Action
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {confirmData.type === "complete"
                  ? "Are you sure you want to mark this project as completed?"
                  : "Are you sure you want to delete this project? This action cannot be undone."}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() =>
                  setConfirmData({ open: false, projectId: null, type: "" })
                }
                className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`flex-1 px-4 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 ${
                  confirmData.type === "delete"
                    ? "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
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
