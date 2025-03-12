import { useState } from 'react'
import blogService from '../services/blogs'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '../NotificationContext'
import { useUserValue } from '../UserContext'

const Blog = ({ blog }) => {
  const showNotification = useNotification()
  const loggedUser = useUserValue()
  const [viewDetails, setViewDetails] = useState(false)
  // retrieve the existing QueryClient instance
  const queryClient = useQueryClient()
  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
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

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const buttonLabel = viewDetails ? 'hide' : 'view'

  /* this works but if the like button is pressed too fast, the update
  is not equal to the number of times the button is pressed
  TODO: implement a fix! */
  const increaseLikes = async (event) => {
    event.preventDefault()
    // const updatedBlog = {
    //   ...localBlog,
    //   likes: localBlog.likes + 1,
    //   /* set the user id here explicitly to avoid mongoose schema
    //   violation when using the `$set` update method */
    //   user: localBlog.user.id
    // }

    // const returnedBlog = await blogService.updateLikes(blog.id, updatedBlog)
    // // required to update the likes displayed
    // setLocalBlog(returnedBlog)

    // /* signal to parent to update the blogs list (which will include
    // the new updates) */
    // if (updateBlogs) {
    //   await updateBlogs()
    // }
    // use just the ID instead of the full user object to avoid
    // mongoose schema violation
    const updatedBlog = { ...blog, likes: blog.likes + 1, user: blog.user.id }
    updateBlogMutation.mutate(updatedBlog)
  }

  const remove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      // removeBlog(blog.id)
      deleteBlogMutation.mutate(blog.id, {
        onSuccess: () => {
          showNotification(`Removed ${blog.title} by ${blog.author}`, 'success')
        },
        onError: (error) => {
          showNotification(error.response?.data || error.message, 'error')
        },
      })
    }
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={() => setViewDetails(!viewDetails)}>
        {buttonLabel}
      </button>
      {viewDetails && (
        <div className="blog-details">
          {blog.url} <br />
          <span data-testid="likes">{blog.likes}</span>{' '}
          <button onClick={increaseLikes}>like</button> <br />
          {blog.user.name} <br />
          {loggedUser && blog.user.username === loggedUser.username && (
            <button onClick={remove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
