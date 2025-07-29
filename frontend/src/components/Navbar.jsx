import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on login/register pages
  if (location.pathname === "/" || location.pathname === "/register")
    return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="font-bold text-xl">
          PixelForge Nexus
        </Link>

        {user?.role === "Admin" && (
          <>
            <Link to="/register" className="hover:text-gray-300">
              Register User
            </Link>
          </>
        )}

        {user?.role === "Project Lead" && (
          <>{/* Future: Lead-specific links can go here */}</>
        )}

        {user?.role === "Developer" && (
          <>{/* Developer-specific links can go here */}</>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/settings" className="hover:text-gray-300">
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
