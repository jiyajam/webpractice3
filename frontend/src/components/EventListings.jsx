import { Link } from 'react-router-dom'

const EventListings = ({ events }) => {
  if (!events || events.length === 0) {
    return <p>No events available.</p>
  }

  return (
    <div className='event-list'>
      {events.map((event) => (
        <div className='event-preview' key={event._id}>
          <Link to={`/events/${event._id}`}>
            <h2>{event.title}</h2>
          </Link>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <p>Organizer: {event.organizer.name}</p>
        </div>
      ))}
    </div>
  )
}

export default EventListings
