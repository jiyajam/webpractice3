const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: {
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
  },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

//add  virtual field id
eventSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id
    return ret
  },
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event
