// frontend/src/components/layout/Sidebar.jsx
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';
import logo from '../../assets/headerLogo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const sidebarRef = useRef(null);

  const menuItems = [
    { name: 'Dashboard',      icon: 'dashboard',        path: '/' },
    { name: 'Import Jobs',    icon: 'input',            path: '/jobs/import' },
    { name: 'Export Jobs',    icon: 'output',           path: '/jobs/export' },
    { name: 'Masters',        icon: 'folder_open',      path: '/masters' },
    { name: 'Customers',      icon: 'people',           path: '/masters/customers' },
    { name: 'Reports',        icon: 'bar_chart',        path: '/reports' },
    { name: 'Users',          icon: 'manage_accounts',  path: '/users' },
    { name: 'Settings',       icon: 'settings',         path: '/settings' },
  ];

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        // Don't close if clicking the navbar menu button
        const menuBtn = document.querySelector('.menu-btn');
        if (menuBtn && menuBtn.contains(event.target)) return;

        toggleSidebar(); // This will close it
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, toggleSidebar]);

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <img src={logo} alt="Harbour Lines" className="logo-img" />
          {isOpen && <span className="logo-text">Harbour Lines</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => window.innerWidth < 1024 && toggleSidebar()} // Auto-close on mobile after click
          >
            <span className="material-symbols-rounded nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-text">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <button onClick={toggleSidebar} className="sidebar-toggle">
        <span className="material-symbols-rounded">
          {isOpen ? 'chevron_left' : 'chevron_right'}
        </span>
      </button>
    </div>
  );
};

export default Sidebar;