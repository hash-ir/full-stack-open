import { useField } from '../hooks/field'
import { useRef } from 'react'
import { useUserValue } from '../UserContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../NotificationContext'
import Togglable from './Togglable'
import { Form, Button } from 'react-bootstrap'

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
      <Form onSubmit={handleSubmit}>
        <h2>create new</h2>
        <Form.Group>
          <Form.Label>title</Form.Label>
          <Form.Control
            {...title}
            name="Title"
            id="blog-title"
            data-testid="title"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author</Form.Label>
          <Form.Control
            {...author}
            name="Author"
            id="blog-author"
            data-testid="author"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url</Form.Label>
          <Form.Control {...url} name="URL" id="blog-url" data-testid="url" />
        </Form.Group>
        <Button variant="primary" type="submit">
          create
        </Button>
      </Form>
    </Togglable>
  )
}

export default BlogForm
