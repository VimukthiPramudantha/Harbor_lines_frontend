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
  const [seaJobsOpen, setSeaJobsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: "dashboard", path: "/dashboard" },

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

    // FREIGHT MASTER
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

    // SEA FREIGHT JOBS
    {
      name: "Sea Freight Jobs",
      icon: "anchor",
      isDropdown: true,
      isOpen: seaJobsOpen,
      onToggle: () => setSeaJobsOpen(!seaJobsOpen),
      subItems: [
        {
          name: "Import",
          icon: "input",
          isDropdown: true,
          isOpen: seaJobsOpen,
          onToggle: () => {}, // no action needed
          subItems: [
            {
              name: "Job Master - Import",
              path: "/sea-freight/import/job-master",
              icon: "note_add"
            }
            // Add more import pages here later
          ]
        }
        // Export will be added later
      ]
    },

    { name: "Reports", icon: "bar_chart", path: "/reports" },
    { name: "Users", icon: "manage_accounts", path: "/users" },
    { name: "Settings", icon: "settings", path: "/settings" },
  ];

  // Auto-open dropdowns based on current path
  useEffect(() => {
    if (location.pathname.startsWith("/masters/")) setMastersOpen(true);
    if (location.pathname.startsWith("/freight/")) setFreightOpen(true);
    if (location.pathname.startsWith("/sea-freight/")) setSeaJobsOpen(true);
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

  // Active state for collapsed sidebar
  const isMasterFilesActive = location.pathname.startsWith("/masters/");
  const isFreightActive = location.pathname.startsWith("/freight/");
  const isSeaJobsActive = location.pathname.startsWith("/sea-freight/");

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
                    (item.name === "Freight Master" && isFreightActive) ||
                    (item.name === "Sea Freight Jobs" && isSeaJobsActive))
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
                  <div key={sub.name}>
                    {sub.isDropdown ? (
                      <div
                        className={`submenu-item dropdown ${sub.isOpen ? "open" : ""}`}
                        onClick={sub.onToggle}
                      >
                        <span className="material-symbols-rounded submenu-icon">
                          {sub.icon}
                        </span>
                        <span className="submenu-text">{sub.name}</span>
                        <span className="material-symbols-rounded dropdown-arrow small">
                          {sub.isOpen ? "expand_less" : "expand_more"}
                        </span>
                      </div>
                    ) : (
                      <NavLink
                        to={sub.path}
                        className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}
                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      >
                        <span className="material-symbols-rounded submenu-icon">
                          {sub.icon}
                        </span>
                        <span className="submenu-text">{sub.name}</span>
                      </NavLink>
                    )}

                    {/* Nested submenu for Import */}
                    {sub.isDropdown && sub.isOpen && isOpen && (
                      <div className="nested-submenu">
                        {sub.subItems.map((nested) => (
                          <NavLink
                            key={nested.name}
                            to={nested.path}
                            className={({ isActive }) => `nested-item ${isActive ? "active" : ""}`}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                          >
                            <span className="material-symbols-rounded nested-icon">
                              {nested.icon}
                            </span>
                            <span className="nested-text">{nested.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
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