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

module.exports = blogsRouter