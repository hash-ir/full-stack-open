import Blog from "./Blog"

const Blogs = (name, blogs) => {
    return (
        <div>
            <h2>blogs</h2>
            <p>{name} logged in</p>
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default Blogs