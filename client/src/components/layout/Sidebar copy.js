import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [hoverExpanded, setHoverExpanded] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith('/settings')) {
      setSubmenuOpen(true);
    }
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (!isOpen) setHoverExpanded(true);
  };

  const handleMouseLeave = () => {
    setHoverExpanded(false);
  };

  const isSidebarExpanded = isOpen || hoverExpanded;

  const menuItemClass = (isExpanded) =>
    `nav-link d-flex align-items-center ${isExpanded ? '' : 'justify-content-center'}`;

  const iconClass = (isExpanded) =>
    `bi fs-5 ${isExpanded ? 'me-2' : 'me-0'}`;

  return (
    <div
      className={`sidebar p-3 ${isSidebarExpanded ? '' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Toggle Button */}
      <div className={`sidebar-toggle-btn mb-3 ${isSidebarExpanded ? 'text-end' : 'text-center'}`}>
        <button className="btn btn-light btn-sm" onClick={toggleSidebar}>
          <i className={`bi ${isSidebarExpanded ? 'bi-arrow-left-circle' : 'bi-arrow-right-circle'}`}></i>
        </button>
      </div>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `${menuItemClass(isSidebarExpanded)} ${isActive ? 'active' : ''}`}
          >
            <i className={`${iconClass(isSidebarExpanded)} bi-speedometer2`}></i>
            {isSidebarExpanded && <span className="small">Dashboard</span>}
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/profile"
            className={({ isActive }) => `${menuItemClass(isSidebarExpanded)} ${isActive ? 'active' : ''}`}
          >
            <i className={`${iconClass(isSidebarExpanded)} bi-person`}></i>
            {isSidebarExpanded && <span className="small">Profile</span>}
          </NavLink>
        </li>

        <li className="nav-item">
          <div
            className={menuItemClass(isSidebarExpanded)}
            style={{ cursor: 'pointer' }}
            onClick={() => setSubmenuOpen(!submenuOpen)}
          >
            <i className={`${iconClass(isSidebarExpanded)} bi-gear`}></i>
            {isSidebarExpanded && <span className="small">Settings</span>}
            {isSidebarExpanded && (
              <i className={`bi ms-auto ${submenuOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            )}
          </div>

          <div
            className="submenu ps-3"
            style={{
              overflow: 'hidden',
              transition: 'height 0.3s ease',
              height: submenuOpen && isSidebarExpanded ? '80px' : '0',
            }}
          >
            {isSidebarExpanded && (
              <>
                <NavLink to="/settings/security" className="nav-link small">Security</NavLink>
                <NavLink to="/settings/tools" className="nav-link small">Tools</NavLink>
              </>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
