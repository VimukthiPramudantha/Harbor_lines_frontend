// frontend/src/components/layout/Sidebar.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../../styles/Sidebar.css";
import logo from "../../assets/headerLogo.png";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  // Dropdown states
  const [mastersOpen, setMastersOpen] = useState(false);
  const [freightOpen, setFreightOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "dashboard", path: "/dashboard" },
    { name: "Import Jobs", icon: "input", path: "/jobs/import" },
    { name: "Export Jobs", icon: "output", path: "/jobs/export" },

    // MASTER FILES
    {
      name: "Master Files",
      icon: "folder_open",
      isDropdown: true,
      isOpen: mastersOpen,
      onToggle: () => setMastersOpen(!mastersOpen),
      subItems: [
        { name: "Customer / Supplier", path: "/masters/customers", icon: "people" },
        { name: "Currency", path: "/masters/currency", icon: "currency_exchange" },
        { name: "Unit of Measurement", path: "/masters/uom", icon: "square_foot" },
        { name: "Bank Maintenance", path: "/masters/bank", icon: "account_balance" },
        { name: "Tax Maintenance", path: "/masters/tax", icon: "receipt_long" },
      ],
    },

    // FREIGHT MASTER - NEW!
    {
      name: "Freight Master",
      icon: "directions_boat",
      isDropdown: true,
      isOpen: freightOpen,
      onToggle: () => setFreightOpen(!freightOpen),
      subItems: [
        { name: "Vessel Maintenance", path: "/freight/vessel", icon: "directions_boat_filled" },
        { name: "Flight Maintenance", path: "/freight/flight", icon: "flight" },
        { name: "Sea Destination Maintenance", path: "/freight/sea-destination", icon: "anchor" },
        { name: "Air Destination Maintenance", path: "/freight/air-destination", icon: "flight" },
        ],
    },

    { name: "Reports", icon: "bar_chart", path: "/reports" },
    { name: "Users", icon: "manage_accounts", path: "/users" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ];

  // Auto-open dropdowns based on current path
  useEffect(() => {
    if (location.pathname.startsWith("/masters/")) {
      setMastersOpen(true);
    }
    if (location.pathname.startsWith("/freight/")) {
      setFreightOpen(true);
    }
  }, [location.pathname]);

  // Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        const menuBtn = document.querySelector(".menu-btn");
        if (menuBtn && menuBtn.contains(event.target)) return;
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, toggleSidebar]);

  // Check active parent for collapsed sidebar
  const isMasterFilesActive = location.pathname.startsWith("/masters/");
  const isFreightActive = location.pathname.startsWith("/freight/");

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="Harbour Lines" className="logo-img" />
          {isOpen && <span className="logo-text">Harbour Lines</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.isDropdown ? (
              <div
                className={`nav-item dropdown ${item.isOpen ? "open" : ""} ${
                  !isOpen &&
                  ((item.name === "Master Files" && isMasterFilesActive) ||
                    (item.name === "Freight Master" && isFreightActive))
                    ? "active"
                    : ""
                }`}
                onClick={item.onToggle}
              >
                <span className="material-symbols-rounded nav-icon">
                  {item.icon}
                </span>
                {isOpen && (
                  <>
                    <span className="nav-text">{item.name}</span>
                    <span className="material-symbols-rounded dropdown-arrow">
                      {item.isOpen ? "expand_less" : "expand_more"}
                    </span>
                  </>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
              >
                <span className="material-symbols-rounded nav-icon">
                  {item.icon}
                </span>
                {isOpen && <span className="nav-text">{item.name}</span>}
              </NavLink>
            )}

            {/* Submenu */}
            {item.isDropdown && item.isOpen && isOpen && (
              <div className="submenu">
                {item.subItems.map((sub) => (
                  <NavLink
                    key={sub.name}
                    to={sub.path}
                    className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  >
                    <span className="material-symbols-rounded submenu-icon">
                      {sub.icon}
                    </span>
                    <span className="submenu-text">{sub.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <button onClick={toggleSidebar} className="sidebar-toggle">
        <span className="material-symbols-rounded">
          {isOpen ? "chevron_left" : "chevron_right"}
        </span>
      </button>
    </div>
  );
};

export default Sidebar;