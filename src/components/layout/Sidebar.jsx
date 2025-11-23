import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
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

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon"></div>
          {isOpen && <span className="logo-text">Harbour Lines</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
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