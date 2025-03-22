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
import Blog from './components/Blog'
import { Nav, Navbar } from 'react-bootstrap'

const App = () => {
  const user = useUserValue()
  useInitAuth()

  // login page
  if (user === null) {
    return (
      <div className="container">
        <Notification />
        <h2>log in to application</h2>
        <LoginForm />
      </div>
    )
  }

  const padding = {
    padding: 5,
  }

  // blog list page
  return (
    <Router>
      <div className="container">
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/">
                  blogs
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">
                  users
                </Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <em style={padding}>{user.name} logged in</em>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <LogoutButton />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Notification />
        <h2>blog app</h2>
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<Blog />} />
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
