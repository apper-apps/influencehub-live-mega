import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className = '',
  filters = [],
  onFilterChange,
  ...props 
}) => {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  const handleSearch = (value) => {
    setQuery(value)
    if (onSearch) onSearch(value)
  }

  const toggleFilter = (filter) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter]
    
    setActiveFilters(newFilters)
    if (onFilterChange) onFilterChange(newFilters)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="form-input pl-10 pr-4"
          {...props}
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <ApperIcon name="X" size={18} />
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                ${activeFilters.includes(filter)
                  ? 'bg-primary text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar