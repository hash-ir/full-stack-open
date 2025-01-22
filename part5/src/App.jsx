import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import Login from './components/Login'
import Create from './components/Create'
import blogService from './services/blogs'
import loginService from './services/login'

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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson || user) {
      window.localStorage.removeItem('loggedUser')
      setUser(null)
    } else {
      console.error(`${user.username} is not logged in`)
    }
  }

  const handleCreateBlog = async (event) => {
    // event.preventDefault()
    try {
      blogService.setToken(user.token)
      blogService.create(newBlog)
      blogService.getAll().then(blogs => 
        setBlogs(blogs)
      )
    } catch (error) {
      console.error('Blog could not be added:', error.response ? error.response.data : error.message)
    }
    
  }

  return (
    <div>
      {user === null ?
        Login({username, password}, {setUsername, setPassword}, handleLogin) :
        <div>
          <h2>blogs</h2>
          <p>{user.username} logged in<button onClick={handleLogout}>logout</button></p>
          {Create(newBlog, setNewBlog, handleCreateBlog)}
          {Blogs(user.name, blogs, handleLogout)}
        </div> 
      }
    </div>
  )
}

export default App