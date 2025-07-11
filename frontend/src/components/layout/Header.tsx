import { NavLink, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "../../contexts/AuthProvider";

const Header: React.FC = () => {
  const linkClass =
    "flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 transition-colors";

  const activeClass = "text-blue-600";
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    localStorage.clear();
    logout();
    navigate("/sign-in");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">URL Crawler</h1>
        <nav className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
            end
          >
            <Home size={18} />
            Home
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1 rounded-sm cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
