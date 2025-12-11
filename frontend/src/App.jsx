import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages & components
import Navbar from './components/Navbar'
import Home from './pages/HomePage'
import AddEventPage from './pages/AddEventPage'
import EventPage from './pages/EventPage'
import NotFoundPage from './pages/NotFoundPage'
import EditEventPage from './pages/EditEventPage'

const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <div className='content'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/events/add-event' element={<AddEventPage />} />
            <Route path='/edit-event/:id' element={<EditEventPage />} />
            <Route path='/events/:id' element={<EventPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
