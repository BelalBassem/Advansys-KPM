import { Search, Bell, Sun, UserCircle } from 'lucide-react'
import '../styles/Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <img className="navbar-logo" src="/advansys_name.png" alt="Advansys" />

      <div className="navbar-links">
        <button className="navbar-link">Home</button>
        <button className="navbar-link">Lessons Learned</button>
        <button className="navbar-link">Processes</button>
        <button className="navbar-link">Projects and Libraries</button>
      </div>

      <div className="navbar-icons">
        <button className="navbar-icon-button" aria-label="Search">
          <Search className="navbar-icon" />
        </button>
        <button className="navbar-icon-button" aria-label="Notifications">
          <Bell className="navbar-icon" />
        </button>
        <button className="navbar-icon-button" aria-label="Theme">
          <Sun className="navbar-icon" />
        </button>
        <button className="navbar-icon-button" aria-label="Profile">
          <UserCircle className="navbar-icon" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
