import React, { useState } from 'react'
import { createMeetz } from '../services/api'
import { useAppContext } from '../context/AppContext'

const CreateMeet: React.FC = () => {
  const { user } = useAppContext()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('You must be signed in to create a Meet.')
      return
    }
    try {
      await createMeetz({ title, description, date, hostId: user.id })
      // Reset form and show success message
      setTitle('')
      setDescription('')
      setDate('')
      setError(null)
      alert('Meet created successfully!')
    } catch (err) {
      setError('Failed to create Meet. Please try again.')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create a New Meet</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
        <div>
          <label htmlFor="date" className="block mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded">
          Create Meet
        </button>
      </form>
    </div>
  )
}

export default CreateMeet