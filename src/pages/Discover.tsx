import React, { useEffect, useState } from 'react'
import { fetchDiscoverMeetz } from '../services/api'
import MeetCard from '../components/MeetCard'
import { Search, Calendar } from 'lucide-react'

const Discover: React.FC = () => {
  const [meetz, setMeetz] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    friends: false,
    squad: false,
    clans: false,
  })
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadMeetz = async () => {
      try {
        const data = await fetchDiscoverMeetz()
        setMeetz(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load Meetz. Please try again later.')
        setLoading(false)
      }
    }
    loadMeetz()
  }, [])

  const handleRemove = (id: string) => {
    setMeetz(meetz.filter((meet: any) => meet.id !== id))
  }

  const handleClick = (meet: any) => {
    // Handle click event (e.g., navigate to meet details)
    console.log('Clicked meet:', meet)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSearch = () => {
    // Implement search logic here
    console.log('Search term:', searchTerm)
    console.log('Filters:', filters)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">search meetz</h1>
      <div className="bg-background-light dark:bg-gray-800 p-4 rounded-lg mb-4">
        <div className="flex items-center mb-4">
          <Search className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search meetz"
            className="flex-grow bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-light dark:focus:border-primary-dark"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center">
            <Calendar className="text-gray-400 mr-2" />
            <input
              type="date"
              name="fromDate"
              placeholder="From Date"
              className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-light dark:focus:border-primary-dark"
              value={filters.fromDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="flex items-center">
            <Calendar className="text-gray-400 mr-2" />
            <input
              type="date"
              name="toDate"
              placeholder="To Date"
              className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-primary-light dark:focus:border-primary-dark"
              value={filters.toDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="friends"
              checked={filters.friends}
              onChange={handleFilterChange}
              className="mr-2"
            />
            Friends
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="squad"
              checked={filters.squad}
              onChange={handleFilterChange}
              className="mr-2"
            />
            Squad
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="clans"
              checked={filters.clans}
              onChange={handleFilterChange}
              className="mr-2"
            />
            Clans
          </label>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-primary-light dark:bg-primary-dark text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meetz.map((meet: any) => (
          <MeetCard
            key={meet.id}
            meet={meet}
            onRemove={handleRemove}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  )
}

export default Discover