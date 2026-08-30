import { Search } from 'lucide-react'
import '../styles/Search.css'

function SearchBar() {
  return (
    <section className="search-box">
      <div className="search-input-box">
        <Search className="search-icon" size={18} />
        <input
          className="search-input"
          type="text"
          placeholder="Search for a lesson..."
          aria-label="Search for a lesson"
        />
      </div>

      <select className="search-select" aria-label="Department">
        <option value="">Department</option>
        <option value="automation">Automation</option>
        <option value="electrical">Electrical</option>
        <option value="design">Design</option>
      </select>

      <select className="search-select" aria-label="Keywords">
        <option value="">Keywords</option>
        <option value="plc">PLC</option>
        <option value="wiring">Wiring</option>
        <option value="ux">UX</option>
      </select>

      <button className="search-button" type="button">
        Apply
      </button>
    </section>
  )
}

export default SearchBar
