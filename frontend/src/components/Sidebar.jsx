import { NavLink } from 'react-router-dom';

import {
  LayoutDashboard,
  Mail,
  History,
  LogOut,
  X
} from 'lucide-react';

function Sidebar({ isOpen, onClose }) {

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem('isLoggedIn');
    onClose();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>

      <div className="brand">

        <div className="brand-icon">
          <Mail size={23} />
        </div>

        <h2>
          Bulk<span>Mail</span>
        </h2>

        <button
          className="sidebar-close"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={21} />
        </button>

      </div>

      <div className="sidebar-content">

        <p className="menu-label">MAIN MENU</p>

        <nav className="sidebar-nav">

          <NavLink to="/" end onClick={onClose}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/compose" onClick={onClose}>
            <Mail size={20} />
            <span>Compose Email</span>
          </NavLink>

          <NavLink to="/history" onClick={onClose}>
            <History size={20} />
            <span>Email History</span>
          </NavLink>

        </nav>

      </div>

      <div className="sidebar-bottom">

        <NavLink to="/login" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </NavLink>

        <div className="sidebar-footer">
          <p>BulkMail</p>
          <span>Email Management System</span>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
