// Mock data
const mockMeetz = [
  {
    id: '1',
    title: 'Coding Meetup',
    description: "Let's code together and share ideas!",
    place: 'Tech Hub',
    location: 'Downtown',
    dateTime: '2024-04-15T18:00:00',
    host: {
      id: 'user1',
      name: 'John Doe',
      profilePicture: 'https://example.com/john-doe.jpg'
    },
    attendees: [{ id: 'user2' }, { id: 'user3' }, { id: 'user4' }],
    tags: ['coding', 'java', 'spring']
  },
  {
    id: '2',
    title: 'Coffee and Tech Talk',
    description: 'Casual meetup to discuss latest tech trends over coffee',
    place: 'Cafe Geek',
    location: 'Uptown',
    dateTime: '2024-04-20T10:00:00',
    host: {
      id: 'user2',
      name: 'Jane Smith',
      profilePicture: 'https://example.com/jane-smith.jpg'
    },
    attendees: [{ id: 'user1' }, { id: 'user3' }],
    tags: ['tech', 'coffee', 'networking']
  },
  {
    id: '3',
    title: 'Yoga Session',
    description: 'Beginner-friendly yoga class',
    place: 'Zen Garden',
    location: 'Park',
    dateTime: '2024-04-25T09:00:00',
    host: {
      id: 'user3',
      name: 'Charlie Brown',
      profilePicture: 'https://example.com/charlie-brown.jpg'
    },
    attendees: [{ id: 'user2' }, { id: 'user4' }, { id: 'user5' }, { id: 'user6' }],
    tags: ['yoga', 'wellness', 'fitness']
  },
]

const mockUsers = [
  { id: 'user1', name: 'Alice', email: 'alice@example.com', bio: 'Tech enthusiast' },
  { id: 'user2', name: 'Bob', email: 'bob@example.com', bio: 'Avid reader' },
  { id: 'user3', name: 'Charlie', email: 'charlie@example.com', bio: 'Yoga instructor' },
]

export const fetchMeetz = () => {
  return Promise.resolve(mockMeetz)
}

export const fetchDiscoverMeetz = () => {
  return Promise.resolve(mockMeetz)
}

export const createMeetz = (meetData: any) => {
  const newMeet = { id: String(mockMeetz.length + 1), ...meetData }
  mockMeetz.push(newMeet)
  return Promise.resolve(newMeet)
}

export const joinMeetz = (meetId: string, userId: string) => {
  const meet = mockMeetz.find(m => m.id === meetId)
  if (meet) {
    // In a real app, we'd update the meet with the new participant
    return Promise.resolve({ ...meet, attendees: [...(meet.attendees || []), { id: userId }] })
  }
  return Promise.reject(new Error('Meet not found'))
}

export const fetchProfile = (userId: string) => {
  const user = mockUsers.find(u => u.id === userId)
  return user ? Promise.resolve(user) : Promise.reject(new Error('User not found'))
}

export const updateProfile = (userId: string, profileData: any) => {
  const index = mockUsers.findIndex(u => u.id === userId)
  if (index !== -1) {
    mockUsers[index] = { ...mockUsers[index], ...profileData }
    return Promise.resolve(mockUsers[index])
  }
  return Promise.reject(new Error('User not found'))
}

export const fetchHostedMeetz = (userId: string) => {
  const hostedMeetz = mockMeetz.filter(meet => meet.host.id === userId)
  return Promise.resolve(hostedMeetz)
}

export const fetchJoinedMeetz = (userId: string) => {
  // In a real app, we'd check for meets where the user is a participant
  const joinedMeetz = mockMeetz.filter(meet => meet.attendees.some(attendee => attendee.id === userId))
  return Promise.resolve(joinedMeetz)
}

export const flakeMeetz = (meetId: string, userId: string) => {
  const meet = mockMeetz.find(m => m.id === meetId)
  if (meet) {
    // In a real app, we'd remove the user from the attendees list
    const updatedAttendees = meet.attendees.filter(a => a.id !== userId)
    return Promise.resolve({ ...meet, attendees: updatedAttendees })
  }
  return Promise.reject(new Error('Meet not found'))
}

export const acceptAttendee = (meetId: string, attendeeId: string) => {
  const meet = mockMeetz.find(m => m.id === meetId)
  if (meet) {
    // In a real app, we'd move the attendee from pending to confirmed
    return Promise.resolve(meet)
  }
  return Promise.reject(new Error('Meet not found'))
}

export const declineAttendee = (meetId: string, attendeeId: string) => {
  const meet = mockMeetz.find(m => m.id === meetId)
  if (meet) {
    // In a real app, we'd remove the attendee from the pending list
    return Promise.resolve(meet)
  }
  return Promise.reject(new Error('Meet not found'))
}