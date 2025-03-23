import { useSelector } from 'react-redux'
import Blog from './Blog'

const Blogs = ({ loggedUser }) => {
  const blogs = useSelector((state) => state.blogs)
  return (
    <div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} loggedUser={loggedUser} />
      ))}
    </div>
  )
}

export default Blogs
