import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import Login from './components/Login'
import Create from './components/Create'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      setUser(user)
    }

    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
      const user = await loginService.login({username, password})
      setUser(user)
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
    } else {
      console.error(`${user.username} is not logged in`)
    }
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
      blogService.setToken(user.token)
      blogService.create(newBlog)
      blogService.getAll().then(blogs => 
        setBlogs(blogs)
      )
      setNotification(
        `a new blog ${newBlog.title} by ${newBlog.author} added`,
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

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} messageType={messageType} />
        <Login 
          credentials={{username, password}} 
          setCredentials={{setUsername, setPassword}} 
          handleLogin={handleLogin} 
        />
      </div>
    )
  } 

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} messageType={messageType} />
      <p>{user.username} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Create 
        newBlog={newBlog} 
        setNewBlog={setNewBlog} 
        handleCreateBlog={handleCreateBlog}
      />
      <Blogs blogs={blogs} />
    </div> 
  )
}

export default App