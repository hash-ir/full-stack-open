const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { default: mongoose } = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
        {
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the likes of that blog', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    const listWithManyBlogs = [
        {
            _id: "67437241a60ec4695bcbc931",
            title: "How to Ace Machine Learning Interviews: My Personal Playbook",
            author: "Kartik Singhal",
            url: "https://medium.com/@kgk.singhal/how-to-ace-machine-learning-interviews-my-personal-playbook-a75794155157",
            likes: 928,
            __v: 0
        },
        {
            _id: "67440724b9c4f58f98e11974",
            title: "The 37 Best Websites to Learn Something New",
            author: "Kristyna Zapletal",
            url: "https://kristynazapletal.medium.com/the-37-best-websites-to-learn-something-new-895e2cb0cad4",
            likes: 38295,
            __v: 0
        },
        {
            _id: "67440e1112f25b2599576b3e",
            title: "The Crossroads of Should and Must",
            author: "elle luna",
            url: "https://medium.com/@elleluna/the-crossroads-of-should-and-must-90c75eb7c5b0",
            likes: 34519,
            __v: 0
        }
    ]

    test('when list has many blogs, equals the sum of likes of each blog', () => {
        const result = listHelper.totalLikes(listWithManyBlogs)
        assert.strictEqual(result, 928 + 38295 + 34519)
    })

    const listWithNoBlog = []

    test('when list has no blogs, equals 0', () => {
        const result = listHelper.totalLikes(listWithNoBlog)
        assert.strictEqual(result, 0)
    })
}) 

describe('favorite blog', () => {
    const listWithOneBlog = [
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
        }
    ]

    test('when list has only one blog, equals the same blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        const actual = {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            likes: 5,
        }
        assert.deepStrictEqual(result, actual)
    })

    const listWithManyBlogs = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        },
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0
        },
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }  
    ]

    test('when list has many blogs, equals the blog with the most likes', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        const actual = {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
        }
        assert.deepStrictEqual(result, actual)
    })

    const listWithNoBlog = []

    test('when list has no blog, equals "null"', () => {
        const result = listHelper.favoriteBlog(listWithNoBlog)
        assert.equal(result, null)
    })
})

test('blogs are returned in correct amount as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('unique identifier in blog object is named "id"', async () => {
    const blogsAtEnd = await helper.blogsInDb()
    assert(Object.hasOwn(blogsAtEnd[0], "id"))
})

after(async () => {
    await mongoose.connection.close()
})