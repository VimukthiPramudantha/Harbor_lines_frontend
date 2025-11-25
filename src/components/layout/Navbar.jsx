import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import "../../styles/Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [showProfile, setShowProfile] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button onClick={toggleSidebar} className="menu-btn">
          <span className="material-symbols-rounded">menu</span>
        </button>

        <div className="search-bar">
          <span className="material-symbols-rounded">search</span>
          <input type="text" placeholder="Search or Type ......" />
        </div>
      </div>

      <div className="navbar-right">
        <button onClick={toggleTheme} className="theme-toggle">
          <span className="material-symbols-rounded">
            {theme === "light" ? "dark_mode" : "light_mode"}
          </span>
        </button>

        <button className="notification-btn">
          <span className="material-symbols-rounded">notifications</span>
          <span className="badge">3</span>
        </button>

        <div
          className="user-profile"
          onClick={() => setShowProfile(!showProfile)}
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin123"
            alt="User"
            className="user-avatar"
          />
          <span className="user-name">{user?.username || "User"}</span>
          <span className="material-symbols-rounded dropdown-arrow">
            keyboard_arrow_down
          </span>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="dropdown-item">
                <span className="material-symbols-rounded">person</span>
                Profile
              </div>
              <div className="dropdown-item">
                <span className="material-symbols-rounded">settings</span>
                Settings
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item text-danger" onClick={handleLogout}>
                <span className="material-symbols-rounded">logout</span>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
