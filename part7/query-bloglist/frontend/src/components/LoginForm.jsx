import PropTypes from 'prop-types'

const LoginForm = ({ credentials, handleLogin } ) => {
  const { username, password } = credentials

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            {...username}
            data-testid='username'
            name="Username"
          />
        </div>
        <div>
          password
          <input
            {...password}
            data-testid='password'
            name="Password"
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  credentials: PropTypes.object.isRequired,
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm