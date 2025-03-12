import { useField } from '../hooks/field'
import { useRef } from 'react'
import { useUserValue } from '../UserContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../NotificationContext'
import Togglable from './Togglable'

const BlogForm = () => {
  const showNotification = useNotification()
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const blogFormRef = useRef()
  const user = useUserValue()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const populatedBlog = {
        ...newBlog,
        user: {
          id: newBlog.user,
          username: user.username,
          name: user.name,
        },
      }
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(populatedBlog))
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    })

    // // Reset the form
    // setNewBlog({
    //   title: '',
    //   author: '',
    //   url: ''
    // })
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      // only authenticated users can add blogs
      newBlogMutation.mutate(blogObject)
      showNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`,
        'success'
      )
    } catch (error) {
      showNotification(error.response?.data || error.message, 'error')
    }
  }

  return (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <form onSubmit={handleSubmit}>
        <h2>create new</h2>
        <div>
          title
          <input {...title} name="Title" id="blog-title" data-testid="title" />
        </div>
        <div>
          author
          <input
            {...author}
            name="Author"
            id="blog-author"
            data-testid="author"
          />
        </div>
        <div>
          url
          <input {...url} name="URL" id="blog-url" data-testid="url" />
        </div>
        <button type="submit">create</button>
      </form>
    </Togglable>
  )
}

export default BlogForm
