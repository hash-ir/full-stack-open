const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if (!(body.title || body.url)) {
        response.status(400).send()
    }

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        url: body.url,
        author: body.author,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const update = {}
    for (const key of Object.keys(request.body)) {
        if (request.body[key] != '') {
            update[key] = request.body[key]
        }
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { $set: update }, { new: true })
    response.status(201).json(updatedBlog)
})

module.exports = blogsRouter