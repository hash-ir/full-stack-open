import { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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

  return (
    <div>
      {user 
        ? Blogs(user.name, blogs, handleLogout)
        : Login(
          {username, password}, 
          {setUsername, setPassword},
          handleLogin
        )
      }
    </div>
  )
}

export default App