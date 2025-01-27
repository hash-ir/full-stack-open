import Blog from "./Blog"

const Blogs = ({ blogs, updateBlog }) => {
    return (
        <div>
            {blogs.map(blog =>
                <Blog 
                    key={blog.id} 
                    blog={blog}
                    // synchronize local blog updates with parent 
                    updateBlog={updateBlog}
                />
            )}
        </div>
    )
}

export default Blogs