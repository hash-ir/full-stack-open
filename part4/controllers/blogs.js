const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    if (!(request.body.title || request.body.url)) {
        response.status(400).send()
    }

    const blog = new Blog(request.body)
    if (!request.body.likes) {
        blog.likes = 0
    }

    const savedBlog = await blog.save()
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

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {$set: update}, { new: true })
    response.status(201).json(updatedBlog)
})

module.exports = blogsRouter