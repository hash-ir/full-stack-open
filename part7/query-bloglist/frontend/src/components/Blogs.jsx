import Blog from './Blog'

const Blogs = ({ blogs, loggedUser }) => {
  return (
    <div>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          loggedUser={loggedUser}
        />
      )}
    </div>
  )
}

export default Blogs