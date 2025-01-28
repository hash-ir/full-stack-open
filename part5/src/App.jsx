import { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  // control BlogForm component visibility from outside
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
    }

    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
      )
  }, [])

  const setNotification = (message, messageType) => {
    setMessage(message)
    setMessageType(messageType)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      // store in browser's local storage
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message
      setNotification(errorMessage['error'], 'error')
      console.error('Login failed:', errorMessage)
    }
  }


  const handleLogout = async (event) => {
    event.preventDefault()
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson || user) {
      window.localStorage.removeItem('loggedUser')
      setNotification(
        `${user.name} successfully logged out`,
        'success'
      )
      setUser(null)
      // is `else` really needed?
    } else {
      console.error(`${user.username} is not logged in`)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      // only authenticated users can add blogs
      blogService.setToken(user.token)
      const returnedBlog = await blogService.create(blogObject)
      /* no need to call `updateBlogList` here since 'likes' is not
      used as an input (default: 0) and blog is displayed at the
      bottom of the list -> in agreement with the sorting */
      setBlogs(blogs.concat(returnedBlog))

      setNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        'success'
      )
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message
      setNotification(
        errorMessage['error'],
        'error'
      )
      console.error('Blog could not be added:', errorMessage)
    }
  }

  /* re-render the component when a blog is updated
  e.g., by clicking the 'like' button */
  const updateBlogList = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs.sort((a, b) => b.likes - a.likes ))
  }

  const removeBlog = async (id) => {
    try {
      // only authenticated users can remove blogs
      blogService.setToken(user.token)
      await blogService.remove(id)
      updateBlogList()
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data
        : error.message

      console.error('Blog could not be added:', errorMessage)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} messageType={messageType} />
        <LoginForm
          credentials={{ username, password }}
          setCredentials={{ setUsername, setPassword }}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType} />
      <p>{user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel='create new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      <Blogs
        blogs={blogs}
        updateBlogs={updateBlogList}
        removeBlog={removeBlog}
        loggedUser={user}
      />
    </div>
  )
}

export default App