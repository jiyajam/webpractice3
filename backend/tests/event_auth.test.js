const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/userModel')
const Event = require('../models/eventModel')

// Sample user for signup/login
const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'Password123!',
    phone: '+358401234567',
    gender: 'Other',
    date_of_birth: '1995-04-12',
    occupation: 'Engineer',
  },
]

// Sample event
const sampleEvent = {
  title: 'Music Festival',
  date: '2025-07-20',
  location: 'Helsinki Arena',
  organizer: {
    name: 'Event Corp',
    contactEmail: 'contact@eventcorp.com',
    contactPhone: '+358401234999',
  },
}

let token
let user

beforeEach(async () => {
  await User.deleteMany({})
  await Event.deleteMany({})

  const res = await api.post('/api/users/signup').send(users[0])
  token = res.body.token
  user = await User.findOne({ email: users[0].email })
})

describe('Event Routes', () => {
  describe('POST /api/events', () => {
    it('should create a new event when authenticated', async () => {
      const res = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(res.body).toHaveProperty('_id')
      expect(res.body.title).toBe(sampleEvent.title)

      const eventsInDb = await Event.find({})
      expect(eventsInDb).toHaveLength(1)
      expect(eventsInDb[0].title).toBe(sampleEvent.title)
    })

    it('should fail with 401 if token is missing', async () => {
      await api.post('/api/events').send(sampleEvent).expect(401)
    })

    it('should fail with 400 if required fields are missing', async () => {
      await api
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400)
    })
  })

  describe('GET /api/events', () => {
    it('should retrieve all events', async () => {
      const event = new Event({ ...sampleEvent, userId: user._id })
      await event.save()

      const res = await api
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body).toHaveLength(1)
      expect(res.body[0].title).toBe(sampleEvent.title)
    })
  })

  describe('GET /api/events/:id', () => {
    it('should get an event by ID', async () => {
      const event = new Event({ ...sampleEvent, userId: user._id })
      const saved = await event.save()

      const res = await api
        .get(`/api/events/${saved._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body.title).toBe(sampleEvent.title)
    })

    it('should return 404 if event does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      await api
        .get(`/api/events/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })
  })

  describe('PUT /api/events/:id', () => {
    it('should update an event if owner', async () => {
      const event = new Event({ ...sampleEvent, userId: user._id })
      const saved = await event.save()

      const updates = { title: 'Updated Music Festival' }

      const res = await api
        .put(`/api/events/${saved._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)
        .expect(200)

      expect(res.body.title).toBe('Updated Music Festival')
    })
  })

  describe('DELETE /api/events/:id', () => {
    it('should delete event if owner', async () => {
      const event = new Event({ ...sampleEvent, userId: user._id })
      const saved = await event.save()

      await api
        .delete(`/api/events/${saved._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const inDb = await Event.findById(saved._id)
      expect(inDb).toBeNull()
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
