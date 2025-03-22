import { useNotification } from '../NotificationContext'
import { useLogin } from '../UserContext'
import { useField } from '../hooks/field'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { Form, Button } from 'react-bootstrap'

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
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>username</Form.Label>
          <Form.Control {...username} data-testid="username" name="Username" />
        </Form.Group>
        <Form.Group>
          <Form.Label>password</Form.Label>
          <Form.Control {...password} data-testid="password" name="Password" />
        </Form.Group>
        <Button variant="primary" type="submit">
          login
        </Button>
      </Form>
    </div>
  )
}

export default LoginForm
