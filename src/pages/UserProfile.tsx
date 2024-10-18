import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { fetchProfile, updateProfile } from '../services/api'

const UserProfile: React.FC = () => {
  const { user } = useAppContext()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      try {
        const data = await fetchProfile(user.id)
        setProfile(data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load profile. Please try again later.')
        setLoading(false)
      }
    }
    loadProfile()
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      await updateProfile(user.id, profile)
      alert('Profile updated successfully!')
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!profile) return <div>No profile data available.</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block mb-1">Bio</label>
          <textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <button type="submit" className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded">
          Update Profile
        </button>
      </form>
    </div>
  )
}

export default UserProfile