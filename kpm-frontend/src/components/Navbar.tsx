import { useEffect, useState } from 'react'
import { Search, Bell, Moon, Sun, UserCircle } from 'lucide-react'
import '../styles/Navbar.css'

function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

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
        <button
          className="navbar-icon-button navbar-theme-button"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="navbar-icon" />
          ) : (
            <Moon className="navbar-icon" />
          )}
        </button>
        <button className="navbar-icon-button" aria-label="Profile">
          <UserCircle className="navbar-icon" />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
