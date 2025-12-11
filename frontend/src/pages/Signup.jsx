import useField from '../hooks/useField'
import useSignup from '../hooks/useSignup'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()
  const name = useField('text')
  const email = useField('email')
  const password = useField('password')
  const gender = useField('text')
  const date_of_birth = useField('date')
  const occupation = useField('text')
  const phone = useField('text')

  const { signup, error } = useSignup('/api/users/signup')

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    const userData = {
      email: email.value,
      password: password.value,
      name: name.value,
      gender: gender.value,
      date_of_birth: date_of_birth.value,
      occupation: occupation.value,
      phone: phone.value,
    }
    console.log('Sending signup data:', userData)
    const success = await signup(userData)

    if (success) {
      //   setIsAuthenticated(true)
      localStorage.setItem('token', success.token)
      navigate('/')
    }
  }

  return (
    <div className='create'>
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Name:</label>
        <input {...name} />
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />

        <label>Gender:</label>
        <input {...gender} />
        <label>Date of Birth:</label>
        <input {...date_of_birth} />
        <label>Occupation:</label>
        <input {...occupation} />
        <label>Phone:</label>
        <input {...phone} />
        <button>Sign up</button>
      </form>
    </div>
  )
}

export default Signup
