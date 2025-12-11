const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const Event = require('../models/eventModel')
const User = require('../models/userModel')

let token
let user

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

const initEvents = [
  {
    title: 'Music Festival',
    date: new Date('2025-06-20'),
    location: 'Helsinki',
    organizer: {
      name: 'Organizer A',
      contactEmail: 'orgA@example.com',
      contactPhone: '+358401111111',
    },
  },
  {
    title: 'Tech Conference',
    date: new Date('2025-08-15'),
    location: 'Espoo',
    organizer: {
      name: 'Organizer B',
      contactEmail: 'orgB@example.com',
      contactPhone: '+358402222222',
    },
  },
]

// Helper to create a second user and return its token
const createSecondUserAndToken = async () => {
  const secondUser = {
    name: 'Second User',
    email: 'second@example.com',
    password: 'Password123!',
    phone: '+358409999999',
    gender: 'Other',
    date_of_birth: '1990-01-01',
    occupation: 'Tester',
  }

  // Delete if user already exists
  await User.deleteOne({ email: secondUser.email })

  const res = await api.post('/api/users/signup').send(secondUser)
  if (res.status !== 201 || !res.body.token) {
    console.log('Signup failed for second user:', res.body)
    throw new Error('Second user token not returned')
  }

  return res.body.token
}

beforeEach(async () => {
  await User.deleteMany({})
  await Event.deleteMany({})

  // Create main user
  const response = await api.post('/api/users/signup').send(users[0])
  token = response.body.token
  user = await User.findOne({ email: users[0].email })

  // Attach userId to events
  for (let event of initEvents) {
    event.userId = user._id
  }
  await Event.insertMany(initEvents)
})

describe('Event Routes', () => {
  describe('GET /api/events', () => {
    it('returns all events', async () => {
      const res = await api
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const sortedEvents = [...initEvents].sort((a, b) => b.date - a.date)
      expect(res.body[0].title).toBe(sortedEvents[0].title)
      expect(res.body[1].title).toBe(sortedEvents[1].title)
    })
  })

  describe('GET /api/events/:id', () => {
    it('returns an event by ID', async () => {
      const event = await Event.findOne()
      const res = await api
        .get(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      expect(res.body.title).toBe(event.title)
    })

    it('returns 404 if event does not exist', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      await api
        .get(`/api/events/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    it('returns 400 for invalid ID format', async () => {
      await api
        .get('/api/events/123-invalid')
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('POST /api/events', () => {
    it('creates a new event', async () => {
      const newEvent = {
        title: 'Art Expo',
        date: new Date('2025-12-01'),
        location: 'Turku',
        organizer: {
          name: 'Organizer C',
          contactEmail: 'orgC@example.com',
          contactPhone: '+358403333333',
        },
      }

      const res = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send(newEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(res.body.title).toBe(newEvent.title)
      const eventsAfter = await Event.find({})
      expect(eventsAfter).toHaveLength(initEvents.length + 1)
    })

    it('fails with 400 if required fields missing', async () => {
      await api
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400)
    })

    it('fails with 401 if token is missing', async () => {
      const newEvent = {
        title: 'Unauthorized Event',
        date: new Date('2025-10-10'),
        location: 'Oulu',
        organizer: {
          name: 'Organizer X',
          contactEmail: 'x@example.com',
          contactPhone: '+358404444444',
        },
      }
      await api.post('/api/events').send(newEvent).expect(401)
    })
  })

  describe('PUT /api/events/:id', () => {
    it('updates an event if owner', async () => {
      const event = await Event.findOne()
      const updates = { title: 'Updated Music Festival' }

      const res = await api
        .put(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)
        .expect(200)

      expect(res.body.title).toBe('Updated Music Festival')
    })

    it("returns 404 if updating someone else's event", async () => {
      const secondToken = await createSecondUserAndToken()
      const event = await Event.findOne()

      await api
        .put(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${secondToken}`)
        .send({ title: 'Hacked' })
        .expect(404)
    })
  })

  describe('DELETE /api/events/:id', () => {
    it('deletes an event if owner', async () => {
      const event = await Event.findOne()
      await api
        .delete(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const deleted = await Event.findById(event._id)
      expect(deleted).toBeNull()
    })

    it("fails if deleting someone else's event", async () => {
      const secondToken = await createSecondUserAndToken()
      const event = await Event.findOne()

      await api
        .delete(`/api/events/${event._id}`)
        .set('Authorization', `Bearer ${secondToken}`)
        .expect(404)

      const stillInDb = await Event.findById(event._id)
      expect(stillInDb).not.toBeNull()
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
