import { useState } from 'react'
import { Search } from 'lucide-react'
import '../styles/Search.css'

export interface LessonSearchFilters {
  query: string
  departmentId: number | ''
  keyword: string
}

interface SearchDepartment {
  id: number
  name: string
}

interface SearchBarProps {
  departments: SearchDepartment[]
  keywords: string[]
  onApply: (filters: LessonSearchFilters) => void
}

function SearchBar({ departments, keywords, onApply }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [departmentId, setDepartmentId] = useState<number | ''>('')
  const [keyword, setKeyword] = useState('')

  return (
    <form
      className="search-box"
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onApply({ query: query.trim(), departmentId, keyword })
      }}
    >
      <div className="search-input-box">
        <Search className="search-icon" size={18} aria-hidden="true" />
        <input
          className="search-input"
          type="text"
          placeholder="Search for a lesson..."
          aria-label="Search for a lesson"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <select
        className="search-select"
        aria-label="Department"
        value={departmentId}
        onChange={(event) => {
          const selectedId = event.target.value
          setDepartmentId(selectedId === '' ? '' : Number(selectedId))
        }}
      >
        <option value="">All departments</option>
        {departments.map((department) => (
          <option key={department.id} value={department.id}>
            {department.name}
          </option>
        ))}
      </select>

      <select
        className="search-select"
        aria-label="Keyword"
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
      >
        <option value="">All keywords</option>
        {keywords.map((keywordOption) => (
          <option key={keywordOption.toLowerCase()} value={keywordOption}>
            {keywordOption}
          </option>
        ))}
      </select>

      <button className="search-button" type="submit">
        Apply
      </button>
    </form>
  )
}

export default SearchBar
