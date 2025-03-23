import { useState } from 'react'
import blogService from '../services/blogs'
import { deleteBlog, likeBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'

const Blog = ({ blog, loggedUser }) => {
  const [viewDetails, setViewDetails] = useState(false)
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const buttonLabel = viewDetails ? 'hide' : 'view'

  const handleLike = async () => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1,
      // set user field explicitly to avoid mongoose schema violation
      user: blog.user.id,
    }

    dispatch(likeBlog(likedBlog))
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService.setToken(loggedUser.token)
      dispatch(deleteBlog(blog.id))
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
          <button onClick={handleLike}>like</button> <br />
          {blog.user.name} <br />
          {blog.user && blog.user.username === loggedUser.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
