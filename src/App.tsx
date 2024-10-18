import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Discover from './pages/Discover'
import CreateMeet from './pages/CreateMeet'
import UserProfile from './pages/UserProfile'
import { useAppContext } from './context/AppContext'

const App: React.FC = () => {
  const { darkMode, isSidebarOpen } = useAppContext()

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <Header />
      <div className="flex min-h-screen">
        {isSidebarOpen && <Sidebar />}
        <main className="flex-grow pb-16">
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/create" element={<CreateMeet />} />
            <Route path="/profile" element={<UserProfile />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App