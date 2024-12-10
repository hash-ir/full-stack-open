const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'An Awesome Blog',
        author: 'John Doe',
        url: 'https://example.com/@john.doe/an-awesome-blog',
        likes: 1000
    },
    {
        title: 'Blog 2',
        author: 'Mary Jane',
        url: 'https://example.com/@mary.jane/blogs/boring-blog',
        likes: 10
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}