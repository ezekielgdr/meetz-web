import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  profilePicture?: string
}

interface AppContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  darkMode: boolean
  toggleDarkMode: () => void
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  logout: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // Check localStorage for dark mode preference on client-side
    if (typeof window !== 'undefined') {
      try {
        const savedMode = localStorage.getItem('darkMode')
        setDarkMode(savedMode ? JSON.parse(savedMode) : false)
      } catch (error) {
        console.error('Error reading darkMode from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Update localStorage and apply dark mode class on client-side
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
        if (darkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      } catch (error) {
        console.error('Error setting darkMode in localStorage:', error)
      }
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const logout = async () => {
    // Implement logout logic here (e.g., clear user data, remove tokens)
    setUser(null)
    // Add any additional logout logic (e.g., API calls)
  }

  return (
    <AppContext.Provider value={{ user, setUser, darkMode, toggleDarkMode, isSidebarOpen, setIsSidebarOpen, logout }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}