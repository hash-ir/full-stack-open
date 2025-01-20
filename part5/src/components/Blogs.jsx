import Blog from "./Blog"

const Blogs = (name, blogs, handleLogout) => {
    return (
        <div>
            <h2>blogs</h2>
            <p>{name} logged in<button onClick={handleLogout}>logout</button></p>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default Blogs