import Blogs from './components/Blogs'
import Users from './components/Users'
import LoginForm from './components/LoginForm'
import LogoutButton from './components/LogoutButton'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './index.css'
import { useUserValue } from './UserContext'
import { useInitAuth } from './hooks/initAuth'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import User from './components/User'

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
    <Router>
      <div>
        <h2>blogs</h2>
        <Notification />
        <p>
          {user.name} logged in
          <LogoutButton />
        </p>
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path='/users/:id' element={<User />} />
          <Route
            path="/"
            element={
              <>
                <BlogForm />
                <Blogs />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
