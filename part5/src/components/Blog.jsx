import { useState } from "react"

const Blog = ({ blog }) => {
  const [viewDetails, setViewDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const buttonLabel = viewDetails ? 'hide' : 'view'

  return (
    <div style={blogStyle}>
      {blog.title}
      <button onClick={() => setViewDetails(!viewDetails)}>{buttonLabel}</button>
      {
        viewDetails && 
        <div>
          {blog.url} <br />
          {blog.likes} <button>like</button> <br />
          {blog.author}
        </div>
      }
    </div>  
  )
}

export default Blog