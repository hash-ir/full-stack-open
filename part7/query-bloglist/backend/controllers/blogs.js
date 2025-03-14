const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!request.user) {
    return response
      .status(401)
      .json({ error: 'authentication token is required' })
  }

  if (!(body.title || body.url)) {
    response.status(400).json({ error: 'title or url missing' })
  }

  const user = request.user

  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const userid = user._id

  const blogToBeDeleted = await Blog.findById(request.params.id)

  if (blogToBeDeleted.user.toString() === userid.toString()) {
    await Blog.findByIdAndDelete(blogToBeDeleted.id)
    response.status(204).end()
  } else {
    return response.status(401).json({
      error: `Delete aborted. Blog id '${blogToBeDeleted.id}' does not have user id '${userid}'`,
    })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const update = {}
  for (const key of Object.keys(request.body)) {
    if (request.body[key] !== '') {
      update[key] = request.body[key]
    }
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { $set: update },
    { new: true }
  ).populate('user', { username: 1, name: 1 })
  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter
