import { NavLink } from "react-router-dom";
import { Home, ListChecks } from "lucide-react";

const Header: React.FC = () => {
  const linkClass =
    "flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 transition-colors";

  const activeClass = "text-blue-600";

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
          <NavLink
            to="/results"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : "text-gray-700"}`
            }
          >
            <ListChecks size={18} />
            Results
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
