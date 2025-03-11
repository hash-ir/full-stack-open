import { useState, useEffect, useRef } from 'react'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'
import { useNotificationDispatch } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useField } from './hooks/field'

const App = () => {
  const username = useField('text')
  const password = useField('password')
  const [user, setUser] = useState(null)
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
      // queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  // control BlogForm component visibility from App
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const blogs = result.data

  const showNotification = (message, messageType) => {
    dispatch({
      type: 'show',
      message: message,
      messageType: messageType,
    })

    setTimeout(() => {
      dispatch({ type: 'hide' })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`${user.name} logged in`, 'success')
      // store in browser's local storage
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
    } catch (error) {
      showNotification(error.response?.data || error.message, 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    const loggedUserJson = window.localStorage.getItem('loggedUser')
    if (loggedUserJson || user) {
      window.localStorage.removeItem('loggedUser')
      setUser(null)
      showNotification(`${user.name} successfully logged out`, 'success')
      // is `else` really needed?
    } else {
      console.error(`${user.username} is not logged in`)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      // only authenticated users can add blogs
      // blogService.setToken(user.token)
      newBlogMutation.mutate(blogObject)
      showNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        'success'
      )
    } catch (error) {
      showNotification(error.response?.data || error.message, 'error')
    }
  }

  /* re-render the component when a blog is updated
  e.g., by clicking the 'like' button */
  const updateBlogList = async () => {
    const blogs = await blogService.getAll()
    // setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  const removeBlog = async (id) => {
    try {
      // only authenticated users can remove blogs
      blogService.setToken(user.token)
      await blogService.remove(id)
      updateBlogList()
    } catch (error) {
      console.error(
        'Blog could not be added:',
        error.response?.data || error.message
      )
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <LoginForm
          credentials={{ username, password }}
          handleLogin={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
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
