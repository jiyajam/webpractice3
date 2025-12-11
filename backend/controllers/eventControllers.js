const mongoose = require('mongoose')
const Event = require('../models/eventModel')

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: -1 })
    res.status(200).json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'Server Error' })
  }
}

// Create a new event
const createEvent = async (req, res) => {
  try {
    const userId = req.user._id

    // Basic required field validation
    const { title, date, location, organizer } = req.body
    if (!title || !date || !location || !organizer) {
      return res.status(400).json({ error: 'Please add all required fields' })
    }

    const newEvent = new Event({
      ...req.body,
      userId,
    })

    await newEvent.save()
    res.status(201).json(newEvent)
  } catch (error) {
    console.error('Error creating event:', error)

    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }

    res.status(500).json({ error: 'Server Error' })
  }
}

// Get event by ID
const getEventById = async (req, res) => {
  const { eventId } = req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: 'No such event' })
  }

  try {
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ error: 'Server Error' })
  }
}

// Update event by ID
const updateEvent = async (req, res) => {
  const { eventId } = req.params
  const userId = req.user._id

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID' })
  }

  try {
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Ownership check
    if (!event.userId.equals(userId)) {
      return res.status(404).json({ message: 'Event not found' })
    }

    Object.assign(event, req.body)
    await event.save()

    res.status(200).json(event)
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({ error: 'Server Error' })
  }
}

// Delete event by ID
const deleteEvent = async (req, res) => {
  const { eventId } = req.params
  const userId = req.user._id

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ error: 'Invalid event ID' })
  }

  try {
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ message: 'Event not found' })
    }

    // Ownership check
    if (!event.userId.equals(userId)) {
      return res.status(404).json({ message: 'Event not found' })
    }

    await event.deleteOne()
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting event:', error)
    res.status(500).json({ error: 'Server Error' })
  }
}

module.exports = {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
}
