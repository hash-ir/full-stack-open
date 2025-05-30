import PropTypes from 'prop-types'

const LoginForm = ({ credentials, setCredentials, handleLogin } ) => {
  const { username, password } = credentials
  const { setUsername, setPassword } = setCredentials
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            data-testid='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            data-testid='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  credentials: PropTypes.objectOf(PropTypes.string).isRequired,
  setCredentials: PropTypes.objectOf(PropTypes.func).isRequired,
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm