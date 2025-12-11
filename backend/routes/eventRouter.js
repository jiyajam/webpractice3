const express = require('express')
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventControllers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.get('/', getAllEvents)
router.get('/:eventId', getEventById)

router.use(requireAuth)

router.post('/', createEvent)
router.put('/:eventId', updateEvent)
router.delete('/:eventId', deleteEvent)

module.exports = router
