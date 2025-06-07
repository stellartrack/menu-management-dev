import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from "../../utils/logoutUser";
import axiosAuthInstance from '../../api/axiosAuthInstance';

const Header = ({ sidebarOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const username = user?.emp_name || 'User';
  const email = user?.email_id || 'Loading...';
  const designation = user?.designation || '---';

  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [currentCompanyId, setCurrentCompanyId] = useState(null);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const companyDropdownRef = useRef();

  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const avatarDropdownRef = useRef();

  // Modal state for company change alert
  const [showCompanyAlert, setShowCompanyAlert] = useState(false);
  const [pendingCompanyId, setPendingCompanyId] = useState(null);

  // Fetch companies from API
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await axiosAuthInstance.get('/api/stellar_track/master/companies');

        if (res?.data?.status === 'success' && Array.isArray(res.data.data)) {
          const mapped = res.data.data.map(c => ({
            id: c.CompanyID, // Use CompanyID as the unique ID
            name: c.Companyname,
            code: c.CompanyCode,
          }));
          setCompanies(mapped);
        } else {
          console.warn('Unexpected company list response:', res.data);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    }

    fetchCompanies();
  }, []);

  // Sync current company with user.company_id
  useEffect(() => {
    if (companies.length && user?.company_id) {
      const matched = companies.find(c => c.id === user.company_id);
      if (matched) {
        setCurrentCompanyId(matched.id);
      }
    }
  }, [companies, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setCompanyDropdownOpen(false);
      }
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target)) {
        setAvatarDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCompanyDropdown = () => setCompanyDropdownOpen(prev => !prev);
  const toggleAvatarDropdown = () => setAvatarDropdownOpen(prev => !prev);

  // When user clicks a company in dropdown, show modal instead of changing immediately
  const handleSelectCompany = (id) => {
    setPendingCompanyId(id);
    setShowCompanyAlert(true);
    setCompanyDropdownOpen(false);
  };

  const handleCompanyLogout = async () => {
    try {
      const nodeLogoutResponse = await fetch(
        `${import.meta.env.VITE_APP_API_MENU_BASE_URL}api/proxy/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!nodeLogoutResponse.ok) {
        console.error("Node logout failed");
        return;
      }

      const bc = new BroadcastChannel("auth");
      bc.postMessage("logout");
      bc.close();

      window.location.href = `${import.meta.env.VITE_APP_API_AUTH_BASE_URL}login`;
    } catch (error) {
      console.error("Logout process error:", error);
    }
  };


  const handleChangePassword = () => {
    window.location.href = `${import.meta.env.VITE_APP_API_AUTH_BASE_URL}change-password`;
  };


  const getInitials = name => name?.split(' ').map(n => n[0]?.toUpperCase()).join('') || '';
  const currentCompany = companies.find(c => c.id === currentCompanyId) || {};

  return (
    <>
      <header className="bg-light p-3 border-bottom d-flex justify-content-between align-items-center">
        {/* Left side */}
        <div className="d-flex align-items-center">
          <button
            className="btn btn-outline-primary btn-sm me-3"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <i className={`bi fs-5 ${sidebarOpen ? 'bi-x' : 'bi-list'}`}></i>
          </button>

          <div>
            <div>Welcome, <strong>{username}</strong></div>

            {/* Company dropdown */}
            <div className="dropdown" ref={companyDropdownRef} style={{ display: 'inline-block' }}>
              <button
                className="btn btn-link p-0 dropdown-toggle"
                onClick={toggleCompanyDropdown}
                aria-expanded={companyDropdownOpen}
                type="button"
              >
                {loadingCompanies ? 'Loading...' : currentCompany?.name || 'Select Company'}
              </button>

              {companyDropdownOpen && (
                <div className="dropdown-menu show altered-dropdown-menu dropdown-menu-media" style={{ width: 'max-content' }}>
                  {companies.map(company => (
                    <a
                      key={company.id}
                      className={`dropdown-item ${company.id === currentCompanyId ? 'active' : ''}`}
                      onClick={() => handleSelectCompany(company.id)}
                    >
                      {company.name} ({company.code})
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center gap-2 position-relative" ref={avatarDropdownRef}>

          <button
            className="avatar-btn"
            onClick={toggleAvatarDropdown}
            aria-expanded={avatarDropdownOpen}
            aria-haspopup="true"
            title={username}
          >
            {getInitials(username)}
          </button>

          {avatarDropdownOpen && (
            <div className="dropdown-menu dropdown-menu-end show avatar-dropdown" style={{ minWidth: 280 }}>
              <div className="card-body py-3 px-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="avatar-img me-3">
                    <div className="avatar-initials rounded-circle d-flex align-items-center justify-content-center">
                      {getInitials(username)}
                    </div>
                  </div>
                  <div className="user-details flex-grow-1">
                    <p className="mb-1 fw-bold">{username}</p>
                    <p className="mb-1 small text-muted">{email}</p>
                    <p className="mb-0 small text-muted">{designation}</p>
                  </div>
                </div>

                <hr />

                <ul className="header-dropdown-list">
                  <li>
                    <button className="dropdown-item d-flex align-items-center" onClick={handleChangePassword}>
                      <i className="bi bi-lock me-2" /> Change Password
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item d-flex align-items-center text-danger" onClick={logoutUser}>
                      <i className="bi bi-power me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Company Change Alert Modal */}
      {showCompanyAlert && (
        <div className="modal-backdrop">
          <div
            className="modal-content p-4 bg-white rounded shadow"
            style={{ maxWidth: 400, margin: 'auto', marginTop: '15vh' }}
          >
            <h5>Change Company</h5>
            <p>To switch companies, you’ll be logged out and redirected to the cabinet selection page. You can then select a different company from the main dashboard.</p>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCompanyAlert(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowCompanyAlert(false);
                  handleCompanyLogout();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
