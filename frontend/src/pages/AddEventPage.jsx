import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddEventPage = () => {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')

  const [organizerName, setOrganizerName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const user = JSON.parse(localStorage.getItem('user'))
  const token = user ? user.token : null

  const navigate = useNavigate()

  const addEvent = async (newEvent) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      })

      if (!res.ok) {
        throw new Error('Failed to add event')
      }
    } catch (error) {
      console.error(error)
      return false
    }

    return true
  }

  const submitForm = async (e) => {
    e.preventDefault()

    const newEvent = {
      title,
      date,
      location,
      organizer: {
        name: organizerName,
        contactEmail,
        contactPhone,
      },
    }

    await addEvent(newEvent)
    console.log(newEvent)

    navigate('/')
  }

  return (
    <div className='create'>
      <h2>Add a New Event</h2>

      <form onSubmit={submitForm}>
        <label>Event Title:</label>
        <input
          type='text'
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Date:</label>
        <input
          type='date'
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <label>Location:</label>
        <input
          type='text'
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <h3>Organizer Information</h3>

        <label>Organizer Name:</label>
        <input
          type='text'
          required
          value={organizerName}
          onChange={(e) => setOrganizerName(e.target.value)}
        />

        <label>Contact Email:</label>
        <input
          type='email'
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />

        <label>Contact Phone:</label>
        <input
          type='text'
          required
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />

        <button>Add Event</button>
      </form>
    </div>
  )
}

export default AddEventPage
