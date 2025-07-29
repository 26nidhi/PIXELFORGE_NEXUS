import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useContext(AuthContext);

  if (!user) return <p className="text-center mt-10">Unauthorized</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard ({user.role})</h1>

      {user.role === "Admin" && (
        <div>
          <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Add Project
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded">
            Manage Users
          </button>
        </div>
      )}

      {user.role === "Project Lead" && (
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Assign Developers
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Upload Documents
          </button>
        </div>
      )}

      {user.role === "Developer" && (
        <p>You can view your assigned projects and documents here.</p>
      )}
    </div>
  );
}
