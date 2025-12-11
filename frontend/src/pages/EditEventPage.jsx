import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const EditEventPage = () => {
  const [event, setEvent] = useState(null) // Event data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  // Form fields state
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [organizerName, setOrganizerName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`)
        if (!res.ok) throw new Error('Failed to fetch event')
        const data = await res.json()
        setEvent(data)

        // Populate form fields
        setTitle(data.title)
        setDate(new Date(data.date).toISOString().slice(0, 10)) // format YYYY-MM-DD
        setLocation(data.location)
        setOrganizerName(data.organizer.name)
        setContactEmail(data.organizer.contactEmail)
        setContactPhone(data.organizer.contactPhone)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  // Update event function
  const updateEvent = async (updatedEvent) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      })
      if (!res.ok) throw new Error('Failed to update event')
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  const submitForm = async (e) => {
    e.preventDefault()

    const updatedEvent = {
      title,
      date,
      location,
      organizer: {
        name: organizerName,
        contactEmail,
        contactPhone,
      },
    }

    const success = await updateEvent(updatedEvent)
    if (success) navigate(`/events/${id}`)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className='create'>
      <h2>Edit Event</h2>

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

        <label>Name:</label>
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

        <button>Edit Event</button>
      </form>
    </div>
  )
}

export default EditEventPage
