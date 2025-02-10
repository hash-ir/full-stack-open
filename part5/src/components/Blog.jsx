import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlogs, removeBlog, loggedUser }) => {
  const [viewDetails, setViewDetails] = useState(false)
  // synchronize blog state as the 'like' button is pressed
  const [localBlog, setLocalBlog] = useState(blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonLabel = viewDetails ? 'hide' : 'view'

  /* this works but if the like button is pressed too fast, the update
  is not equal to the number of times the button is pressed
  TODO: implement a fix! */
  const increaseLikes = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      /* this avoids violating the schema and using `$set` update
      method of mongodb correctly */
      user: blog.user.id
    }

    const returnedBlog = await blogService.updateLikes(blog.id, updatedBlog)
    // required to update the likes displayed
    setLocalBlog(returnedBlog)

    /* signal to parent to update the blogs list (which will include
    the new updates) */
    if (updateBlogs) {
      await updateBlogs()
    }
  }

  const remove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${localBlog.title} by ${localBlog.author}?`)) {
      removeBlog(localBlog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      {localBlog.title} {localBlog.author}
      <button onClick={() => setViewDetails(!viewDetails)}>{buttonLabel}</button>
      {
        viewDetails &&
        <div className='blog-details'>
          {localBlog.url} <br />
          <span data-testid="likes">{localBlog.likes}</span> <button onClick={increaseLikes}>like</button> <br />
          {localBlog.user.name} <br />
          {
            localBlog.user
            && localBlog.user.username === loggedUser.username
            && <button onClick={remove}>remove</button>
          }
        </div>
      }
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlogs: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired
}

export default Blog