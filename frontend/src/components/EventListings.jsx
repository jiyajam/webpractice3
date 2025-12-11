import { Link } from 'react-router-dom'

const EventListings = ({ events }) => {
  return (
    <div className='event-list'>
      {events.map((event) => (
        <div className='event-preview' key={event._id}>
          <Link to={`/events/${event._id}`}>
            <h2>{event.title}</h2>
          </Link>
          <p>Date: {event.date}</p>
          <p>Organizer: {event.organizer.name}</p>
        </div>
      ))}
    </div>
  )
}

export default EventListings
