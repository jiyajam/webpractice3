import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const EditEventPage = () => {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { id } = useParams()
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))
  const token = user ? user.token : null

  // Event fields
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [organizerName, setOrganizerName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // PUT /events/:id
  const updateEvent = async (updatedEvent) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      })

      if (!res.ok) {
        throw new Error('Failed to update event')
      }
      return true
    } catch (error) {
      console.error('Error updating event:', error)
      return false
    }
  }

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to fetch event')
        }

        const data = await res.json()
        setEvent(data)
        const formatDate = (isoDate) => {
          if (!isoDate) return ''
          return isoDate.split('T')[0] // "2025-12-20"
        }

        // Fill form fields
        setTitle(data.title)
        setDate(formatDate(data.date))
        setLocation(data.location)
        setOrganizerName(data.organizerName)
        setContactEmail(data.contactEmail)
        setContactPhone(data.contactPhone)
      } catch (error) {
        console.error('Fetch event error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id, token])

  // Submit handler
  const submitForm = async (e) => {
    e.preventDefault()

    const updatedEvent = {
      title,
      date,
      location,
      organizerName,
      contactEmail,
      contactPhone,
    }

    const success = await updateEvent(updatedEvent)

    if (success) {
      console.log('Event Updated Successfully')
      navigate(`/events/${id}`)
    } else {
      console.error('Update failed')
    }
  }

  return (
    <div className='create'>
      <h2>Update Event</h2>

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

        <button>Edit</button>
      </form>
    </div>
  )
}

export default EditEventPage
