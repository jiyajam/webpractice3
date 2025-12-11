import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'

// pages & components
import Navbar from './components/Navbar'
import Home from './pages/HomePage'
import AddEventPage from './pages/AddEventPage'
import EventPage from './pages/EventPage'
import EditEventPage from './pages/EditEventPage'
import NotFoundPage from './pages/NotFoundPage'
import Login from './pages/Login'
import Signup from './pages/Signup'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    return user && user.token ? true : false
  })
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/events/:id' element={<EventPage />} />
            <Route path='/events/add-event' element={<AddEventPage />} />
            <Route path='/edit-event/:id' element={<EditEventPage />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
