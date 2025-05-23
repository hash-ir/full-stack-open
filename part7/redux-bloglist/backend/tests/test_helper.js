const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'An Awesome Blog',
    author: 'John Doe',
    url: 'https://example.com/@john.doe/an-awesome-blog',
    likes: 1000,
  },
  {
    title: 'Blog 2',
    author: 'Mary Jane',
    url: 'https://example.com/@mary.jane/blogs/boring-blog',
    likes: 10,
  },
]

const initialUsers = [
  {
    username: 'jdoe',
    name: 'John Doe',
    password: 'maryjane',
  },
  {
    username: 'mjane',
    name: 'Mary Jane',
    password: 'johndoe',
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
}
