import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import LogoutButton from './components/LogoutButton'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './index.css'
import { useUserValue } from './UserContext'
import { useInitAuth } from './hooks/initAuth'

const App = () => {
  const user = useUserValue()
  useInitAuth()

  // login page
  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm />
      </div>
    )
  }

  // blog list page
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <LogoutButton />
      </p>
      <BlogForm />
      <Blogs />
    </div>
  )
}

export default App
