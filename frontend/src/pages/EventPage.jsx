import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const EventPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log('id: ', id)
        const res = await fetch(`/api/events/${id}`)
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await res.json()
        setEvent(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const onDeleteClick = (eventId) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this event? ' + eventId
    )
    if (!confirm) return

    deleteEvent(eventId)
    navigate('/')
  }

  return (
    <div className='event-preview'>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h2>{event.title}</h2>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Location: {event.location}</p>
          <h3>Organizer details</h3>
          <p>Name: {event.organizer.name}</p>
          <p>Email: {event.organizer.contactEmail}</p>
          <p>Phone: {event.organizer.contactPhone}</p>
          <button onClick={() => onDeleteClick(event._id)}>Delete Event</button>
        </>
      )}
    </div>
  )
}

export default EventPage
