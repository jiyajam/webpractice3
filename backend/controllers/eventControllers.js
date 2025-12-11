const mongoose = require('mongoose')
const Event = require('../models/eventModel')

// GET /events — Get all events belonging to the logged-in user
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({
      createdAt: -1,
    })
    res.status(200).json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'Server Error' })
  }
}

// POST /events — Create a new event (protected)
const createEvent = async (req, res) => {
  try {
    const userId = req.user._id

    const newEvent = new Event({
      ...req.body,
      userId,
    })

    await newEvent.save()
    res.status(201).json(newEvent)
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({ error: 'Server Error' })
  }
}

// GET /events/:eventId — Get event by ID (only if it belongs to the user)
const getEventById = async (req, res) => {
  const { eventId } = req.params
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(404).json({ error: 'No such event' })
  }

  try {
    const event = await Event.findById(eventId)
    if (!event) {
      console.log('Event not found')
      return res.status(404).json({ message: 'Event not found' })
    }
    res.status(200).json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ error: 'Server Error' })
  }
}

// PUT /events/:eventId — Update event by ID (protected + owner only)
const updateEvent = async (req, res) => {
  const { eventId } = req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(404).json({ error: 'No such event' })
  }

  try {
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, userId: req.user._id },
      { ...req.body },
      { new: true }
    )

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.status(200).json(updatedEvent)
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({ error: 'Server Error' })
  }
}

// DELETE /events/:eventId — Delete event by ID (protected + owner only)
const deleteEvent = async (req, res) => {
  const { eventId } = req.params

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(404).json({ error: 'No such event' })
  }

  try {
    const deletedEvent = await Event.findOneAndDelete({
      _id: eventId,
      userId: req.user._id,
    })

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.status(204).send() // No Content
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
