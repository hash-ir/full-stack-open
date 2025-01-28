import Blog from "./Blog"

const Blogs = ({ blogs, updateBlogs, removeBlog, loggedUser }) => {
    return (
        <div>
            {blogs.map(blog =>
                <Blog 
                    key={blog.id} 
                    blog={blog}
                    // synchronize local blog updates with parent 
                    updateBlogs={updateBlogs}
                    removeBlog={removeBlog}
                    loggedUser={loggedUser}
                />
            )}
        </div>
    )
}

export default Blogs