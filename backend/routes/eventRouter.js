const express = require('express')
const {
  getAllEvents,
  // getEventById,
  createEvent,
  // updateEvent,
  // deleteEvent,
} = require('../controllers/eventControllers')

const router = express.Router()

router.get('/', getAllEvents)
router.post('/', createEvent)
// router.get("/:eventId", getEventById);
// router.put("/:eventId", updateEvent);
// router.delete("/:eventId", deleteEvent);

module.exports = router
