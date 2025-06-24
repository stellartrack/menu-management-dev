import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import staticMenuData from '../../data/menuData';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [submenuOpen, setSubmenuOpen] = useState({});
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Automatically open submenu if current path matches submenu's path
  useEffect(() => {
    const openState = {};
    staticMenuData.forEach((item) => {
      if (item.submenu && location.pathname.startsWith(item.path)) {
        openState[item.id] = true;
      }
    });
    setSubmenuOpen(openState);
  }, [location.pathname]);

  // Expand sidebar on hover if it's collapsed
  const handleMouseEnter = () => {
    if (!isOpen) setHoverExpanded(true);
  };
  const handleMouseLeave = () => {
    setHoverExpanded(false);
  };

  const isSidebarExpanded = isOpen || hoverExpanded;

  const toggleSubmenu = (id) => {
    setSubmenuOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Close sidebar on backdrop click in mobile mode
  const handleBackdropClick = () => {
    if (isMobile && isOpen) {
      toggleSidebar();
    }
  };

  // Classes for menu items based on sidebar expansion state
  const menuItemClass = (isExpanded) =>
    `nav-link d-flex align-items-center ${isExpanded ? '' : 'justify-content-center'}`;

  const iconClass = (isExpanded) => `bi fs-5 ${isExpanded ? 'me-2' : 'me-0'}`;

  return (
    <>
      {/* Floating toggle button */}
      {(!isMobile || (isMobile && isOpen)) && (
        <div
          className={`floating-sidebar-toggle ${isMobile ? 'mobile-toggle' : 'desktop-toggle'}`}
          style={
            !isMobile
              ? { left: isSidebarExpanded ? '193px' : '53px' }
              : {}
          }
          onClick={toggleSidebar}
          role="button"
          aria-label={isSidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          title={isSidebarExpanded ? 'Collapse menu' : 'Expand menu'}
        >
          <div className="outer-circle">
            <div className="inner-circle">
              <i
                className={`bi ${
                  isMobile
                    ? 'bi-x'
                    : isSidebarExpanded
                    ? 'bi-chevron-left'
                    : 'bi-chevron-right'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile when sidebar is open */}
      {isOpen && isMobile && (
        <div className="sidebar-backdrop" onClick={handleBackdropClick} />
      )}

      {/* Sidebar navigation */}
      <nav
        className={`sidebar p-3 ${isSidebarExpanded ? '' : 'collapsed'} ${isOpen ? 'open' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Sidebar Navigation"
      >
        <ul className="nav flex-column" role="menu">
          {staticMenuData.map((item) => (
            <li key={item.id} className="nav-item" role="none">
              {item.submenu ? (
                <>
                  {/* Parent menu with submenu */}
                  <div
                    className={menuItemClass(isSidebarExpanded)}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleSubmenu(item.id)}
                    role="menuitem"
                    aria-expanded={!!submenuOpen[item.id]}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleSubmenu(item.id);
                      }
                    }}
                  >
                    <i className={`${iconClass(isSidebarExpanded)} bi-${item.icon}`} />
                    {isSidebarExpanded && <span className="">{item.label}</span>}
                    {isSidebarExpanded && (
                      <i
                        className={`bi ms-auto ${
                          submenuOpen[item.id] ? 'bi-chevron-up' : 'bi-chevron-down'
                        }`}
                      />
                    )}
                  </div>

                  {/* Submenu items */}
                  {isSidebarExpanded && submenuOpen[item.id] && (
                    <ul className="nav flex-column ms-3" role="menu">
                      {item.submenu.map((sub) => (
                        <li key={sub.id} className="nav-item" role="none">
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `nav-link  ${isActive ? 'active' : ''}`
                            }
                            role="menuitem"
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                // Single menu item without submenu
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${menuItemClass(isSidebarExpanded)} ${isActive ? 'active' : ''}`
                  }
                  role="menuitem"
                >
                  <i className={`${iconClass(isSidebarExpanded)} bi-${item.icon}`} />
                  {isSidebarExpanded && <span className="">{item.label}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;
