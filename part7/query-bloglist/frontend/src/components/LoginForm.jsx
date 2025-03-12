import PropTypes from 'prop-types'
import { useNotification } from '../NotificationContext'
import { useLogin } from '../UserContext'
import { useField } from '../hooks/field'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = () => {
  const showNotification = useNotification()
  const login = useLogin()
  const username = useField('text')
  const password = useField('password')

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value,
      })
      blogService.setToken(user.token)
      login(user)
      showNotification(`${user.name} logged in`, 'success')
      // store in browser's local storage
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
    } catch (error) {
      showNotification(error.response?.data || error.message, 'error')
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input {...username} data-testid="username" name="Username" />
        </div>
        <div>
          password
          <input {...password} data-testid="password" name="Password" />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
