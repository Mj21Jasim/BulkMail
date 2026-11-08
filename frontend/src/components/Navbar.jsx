import {
  Bell,
  Search,
  UserCircle,
  Menu
} from 'lucide-react';

function Navbar({ onMenuClick }) {

  return (
    <header className="navbar">

      {/* Separate Menu Button */}

      <button
        className="menu-toggle"
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
      >
        <Menu size={23} />
      </button>

      {/* Search */}

      <div className="navbar-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search anything..."
        />
      </div>

      {/* Right Section */}

      <div className="navbar-right">

        <button
          className="notification-btn"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="admin-profile">

          <UserCircle size={34} />

          <div>
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;