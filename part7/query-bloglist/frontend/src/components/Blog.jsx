import { useNavigate, useParams } from 'react-router-dom'
import blogService from '../services/blogs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '../NotificationContext'
import { useUserValue } from '../UserContext'
import { useField } from '../hooks/field'

const Blog = () => {
  const id = useParams().id
  const showNotification = useNotification()
  const loggedUser = useUserValue()
  const queryClient = useQueryClient()
  const comment = useField('text')
  const navigate = useNavigate()

  // fetch the blog data by its id
  const blogQuery = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      // update this specific blog in the cache
      queryClient.setQueryData(['blog', id], updatedBlog)

      // also update the blogs list cache
      const blogs = queryClient.getQueryData(['blogs'])
      const updatedBlogs = blogs.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
      queryClient.setQueryData(['blogs'], updatedBlogs)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  if (blogQuery.isLoading) {
    return <div>loading blog...</div>
  }

  if (blogQuery.isError) {
    return <div>Error loading blog: {blogQuery.error.message}</div>
  }

  const blog = blogQuery.data

  if (!blog) {
    return <div>blog not found</div>
  }

  const increaseLikes = async (event) => {
    event.preventDefault()
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    updateBlogMutation.mutate(updatedBlog)
  }

  const remove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlogMutation.mutate(blog.id, {
        onSuccess: () => {
          navigate('/')
          showNotification(`Removed ${blog.title} by ${blog.author}`, 'success')
        },
        onError: (error) => {
          showNotification(
            error.response?.data?.error ||
              error.response?.data ||
              error.message,
            'error'
          )
        },
      })
    }
  }

  const handleComment = () => {
    const updatedComments = [...blog.comments, comment.value]
    blogService.addComment(id, updatedComments).then((updatedBlog) => {
      updateBlogMutation.mutate(updatedBlog)
    })
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>

      <div className="blog-details">
        <a href={`${blog.url}`}>{blog.url}</a> <br />
        <span data-testid="likes">{blog.likes}</span>{' '}
        <button onClick={increaseLikes}>like</button> <br />
        added by {blog.user.name} <br />
        {loggedUser && blog.user.username === loggedUser.username && (
          <button onClick={remove}>remove</button>
        )}
      </div>
      <div>
        <h3>comments</h3>
        <input {...comment} placeholder="add comment here" />
        <button onClick={handleComment}>add comment</button>
        <ul>
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Blog
